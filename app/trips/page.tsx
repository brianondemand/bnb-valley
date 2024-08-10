import React, { Suspense } from "react";

import EmptyState from "@/components/EmptyState";
import Heading from "@/components/Heading";
import ListingCard from "@/components/ListingCard";
import LoadMore from "@/components/LoadMore";

import { getCurrentUser } from "@/services/user";
import { getReservations } from "@/services/reservation";
import { getFavorites } from "@/services/favorite";

const TripsPage = async () => {
  const user = await getCurrentUser();
  const favorites = await getFavorites();

  if (!user) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  const { listings } = await getReservations({ userId: user.id });

  if (!listings || listings.length === 0) {
    return (
      <EmptyState
        title="No trips found"
        subtitle="Looks like you haven't reserved any trips."
      />
    );
  }

  return (
    <section className="main-container">
      <Heading
        title="Trips"
        subtitle="Where you've been and where you're going."
        backBtn
      />
      <div className=" mt-8 md:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 md:gap-8 gap-4">
        {listings.map((listing) => {
          const { reservation, ...data } = listing;
          const hasFavorited = favorites.includes(listing.id);
          return (
            <ListingCard
              key={listing.id}
              data={data}
              reservation={reservation}
              hasFavorited={hasFavorited}
            />
          );
        })}
        <Suspense fallback={<></>}>
          <LoadMore
            fnArgs={{ userId: user.id }}
            queryFn={getReservations}
            queryKey={["trips", user.id]}
            favorites={favorites}
          />
        </Suspense>
      </div>
    </section>
  );
};

export default TripsPage;
