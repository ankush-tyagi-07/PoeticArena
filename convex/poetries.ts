import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// this mutation is required to generate the url after uploading the file to the storage.
export const getUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});


export const createPoetry = mutation({
  args: {
    audioStorageId: v.id("_storage"),
    poetryTitle: v.string(),
    poetryDescription: v.string(),
    audioUrl: v.string(),
    imageUrl: v.string(),
    imageStorageId: v.id("_storage"),
    voicePrompt: v.string(),
    views: v.number(),
    audioDuration: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .collect();

    if (user.length === 0) {
      throw new ConvexError("User not found");
    }

    return await ctx.db.insert("poetries", {
      audioStorageId: args.audioStorageId,
      user: user[0]._id,
      poetryTitle: args.poetryTitle,
      poetryDescription: args.poetryDescription,
      audioUrl: args.audioUrl,
      imageUrl: args.imageUrl,
      imageStorageId: args.imageStorageId,
      author: user[0].name,
      authorId: user[0].clerkId,
      voicePrompt: args.voicePrompt,
      views: args.views,
      authorImageUrl: user[0].imageURL,
      audioDuration: args.audioDuration,
    });
  },
});

export const getTrendingPoetries = query({
  handler: async (ctx) => {
    const poetry = await ctx.db.query("poetries").collect();

    return poetry.sort((a, b) => b.views - a.views).slice(0, 8);
  },
});

export const getPoetryById = query({
  args: {
    poetryId: v.id("poetries"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.poetryId);
  },
});

export const getAllPoetries = query({
  handler: async (ctx) => {
    return await ctx.db.query("poetries").order("desc").collect();
  },
});


export const getPoetriesByAuthorId = query({
  args: {
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    const poetries = await ctx.db
      .query("poetries")
      .filter((q) => q.eq(q.field("authorId"), args.authorId))
      .collect();

    const totalListeners = poetries.reduce(
      (sum, poetry) => sum + poetry.views,
      0
    );

    return { poetries, listeners: totalListeners };
  },
});

export const getPoetryBySearch = query({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.search === "") {
      return await ctx.db.query("poetries").order("desc").collect();
    }

    const authorSearch = await ctx.db
      .query("poetries")
      .withSearchIndex("search_author", (q) => q.search("author", args.search))
      .take(10);

    if (authorSearch.length > 0) {
      return authorSearch;
    }

    const titleSearch = await ctx.db
      .query("poetries")
      .withSearchIndex("search_title", (q) =>
        q.search("poetryTitle", args.search)
      )
      .take(10);

    if (titleSearch.length > 0) {
      return titleSearch;
    }

    return await ctx.db
      .query("poetries")
      .withSearchIndex("search_body", (q) =>
        q.search("poetryDescription" || "poetryTitle", args.search)
      )
      .take(10);
  },
});

export const updatePoetryViews = mutation({
  args: {
    poetryId: v.id("poetries"),
  },
  handler: async (ctx, args) => {
    const poetry = await ctx.db.get(args.poetryId);

    if (!poetry) {
      throw new ConvexError("Poetry not found");
    }

    return await ctx.db.patch(args.poetryId, {
      views: poetry.views + 1,
    });
  },
});


export const deletePoetry = mutation({
  args: {
    poetryId: v.id("poetries"),
    imageStorageId: v.id("_storage"),
    audioStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const poetry = await ctx.db.get(args.poetryId);

    if (!poetry) {
      throw new ConvexError("Poetry not found");
    }

    await ctx.storage.delete(args.imageStorageId);
    await ctx.storage.delete(args.audioStorageId);
    return await ctx.db.delete(args.poetryId);
  },
});