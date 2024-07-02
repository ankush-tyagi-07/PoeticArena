import {defineSchema,defineTable} from 'convex/server'
import {v} from 'convex/values'

export default defineSchema({
    poetries: defineTable({
        user: v.id('users'),
        poetryTitle: v.string(),
        poetryDescription: v.string(),
        audioUrl: v.string(),
        audioStorageId: v.union(v.id('_storage'),v.null()),
        imageUrl: v.string(),
        imageStorageId: v.union(v.id('_storage'),v.null()),
        author: v.string(),
        authorId: v.string(),
        authorImageUrl: v.string(),
        voicePrompt: v.string(),
        audioDuration: v.number(),
        views: v.number(),
    })
        .searchIndex('search_author', {searchField: 'author'})
        .searchIndex('search_title', {searchField: 'poetryTitle'})
        .searchIndex('search_body', {searchField: 'poetryDescription'}),
    users: defineTable({
        email: v.string(),
        imageURL: v.string(),
        clerkId: v.string(),
        name: v.string(),
    }),
})