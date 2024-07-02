"use client";

import { useQuery } from "convex/react";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PoetryCard from "@/components/PoetryCard";
import ProfileCard from "@/components/ProfileCard";
import { api } from "@/convex/_generated/api";

const ProfilePage = ({
  params,
}: {
  params: {
    profileId: string;
  };
}) => {
  const user = useQuery(api.users.getUserById, {
    clerkId: params.profileId,
  });
  const poetriesData = useQuery(api.poetries.getPoetriesByAuthorId, {
    authorId: params.profileId,
  });

  if (!user || !poetriesData) return <LoaderSpinner />;

  return (
    <section className="mt-9 flex flex-col">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">
        Poet&apos;s Profile
      </h1>
      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          poetryData={poetriesData!}
          imageUrl={user?.imageURL!}
          userFirstName={user?.name!}
        />
      </div>
      <section className="mt-9 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">All Poetries</h1>
        {poetriesData && poetriesData.poetries.length > 0 ? (
          <div className="poetry_grid">
            {poetriesData?.poetries
              ?.slice(0, 4)
              .map((poetry) => (
                <PoetryCard
                  key={poetry._id}
                  imgUrl={poetry.imageUrl!}
                  title={poetry.poetryTitle!}
                  description={poetry.poetryDescription}
                  poetryId={poetry._id}
                />
              ))}
          </div>
        ) : (
          <EmptyState
            title="Poet has not created any poetries yet"
          />
        )}
      </section>
    </section>
  );
};

export default ProfilePage;