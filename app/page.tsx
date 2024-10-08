import React, { FC, Suspense } from "react";
import ListingCard from "@/components/ListingCard";
import LoadMore from "@/components/LoadMore";
import EmptyState from "@/components/EmptyState";
import { getListings } from "@/services/listing";
import { getFavorites } from "@/services/favorite";

export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams?: { [key: string]: string | undefined };
}

const Home: FC<HomeProps> = async ({ searchParams }) => {
  const { listings } = await getListings(searchParams);
  const favorites = await getFavorites();

  console.log("Listings data:", listings); // Debugging: Log the listings data

  if (!listings || listings.length === 0) {
    return (
      <EmptyState
        title="No Listings found"
        subtitle="Looks like you have no properties."
      />
    );
  }

  return (
    <section className="main-container pt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
      {listings.map((listing) => {
        const hasFavorited = favorites.includes(listing.id);
        return (
          <ListingCard
            key={listing.id}
            data={listing}
            hasFavorited={hasFavorited}
          />
        );
      })}
      <Suspense fallback={<></>}>
        <LoadMore
          fnArgs={searchParams}
          queryFn={getListings}
          queryKey={["listings", searchParams]}
          favorites={favorites}
        />
      </Suspense>
    </section>
  );
};

export default Home;
