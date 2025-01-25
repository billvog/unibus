import { type DbBusStop } from "@api/types/models";
import { useLingui } from "@lingui/react/macro";
import { Star } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import ActionButton from "@web/components/ui/drawer/content/action-button";
import { trpc } from "@web/lib/trpc";
import { Events } from "@web/lib/utils/constants";

type FavoriteButtonProps = {
  isFullyOpen: boolean;
  busStop: DbBusStop;
};

const FavoriteButton = ({ isFullyOpen, busStop }: FavoriteButtonProps) => {
  const { t } = useLingui();

  const {
    busStop: { favorites },
  } = trpc.useUtils();

  const [favorite, setFavorite] = React.useState(false);

  const favoriteMutation = trpc.busStop.favorite.useMutation({
    onSuccess: () => {
      // Capture event
      window.dispatchEvent(
        new CustomEvent(Events.Analytics.BusStopFavorite, {
          detail: {
            busStop: {
              id: busStop.id,
            },
            favorite: !favorite,
          },
        })
      );

      // Update cache
      favorites.setData(undefined, (prev) => {
        if (!prev) return [busStop.id];

        if (prev.includes(busStop.id)) {
          return prev?.filter((id) => id !== busStop.id);
        }

        return [...prev, busStop.id];
      });

      // Toggle favorite state
      setFavorite((prev) => !prev);
    },
    onError: () => {
      toast.error(t`An error occurred while updating favorites`);
    },
  });

  React.useEffect(() => {
    setFavorite(favorites.getData()?.includes(busStop.id) ?? false);
  }, [favorites, busStop.id]);

  return (
    <ActionButton
      icon={
        <Star
          size={18}
          className="text-yellow-400"
          fill="#facc15"
          fillOpacity={favorite ? 1 : 0}
        />
      }
      label={favorite ? t`Remove from favorites` : t`Add to favorites`}
      loading={favoriteMutation.isPending}
      isCompact={!isFullyOpen}
      onClick={() =>
        void favoriteMutation.mutate({
          favorite: !favorite,
          stopId: busStop.id,
        })
      }
    />
  );
};

export default FavoriteButton;
