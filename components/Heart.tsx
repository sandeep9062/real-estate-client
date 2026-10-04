"use client";
import { AiFillHeart } from "react-icons/ai";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/authSlice";
import { useToFavMutation, useGetUserByIdQuery } from "@/services/userApi";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface HeartProps {
  card: any;
}

const Heart: React.FC<HeartProps> = ({ card }) => {
  const user = useSelector(selectUser);
  const router = useRouter();

  const [toFav] = useToFavMutation();
  const { data: userData, refetch } = useGetUserByIdQuery(user?._id!, {
    skip: !user,
  });

  const cardId = card?._id || card?.id;

  const favourited =
    userData?.favProperties?.some((f: any) => {
      const favId = typeof f === "string" ? f : f?._id || f?.id;
      return favId === cardId;
    }) || false;

  const handleLike = async () => {
    if (!user) {
      toast.error("You must be logged in to do that");
      router.push("/login");
      return;
    }

    try {
      await toFav(card).unwrap(); // mutation toggles it
      refetch();
      toast.success(
        favourited ? "Removed from favourites" : "Added to favourites",
      );
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.error || "Something went wrong",
      );
    }
  };
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleLike();
      }}
      aria-label={favourited ? "Remove from favourites" : "Add to favourites"}
      className={[
        // Calmed down from the old glow/shrink treatment: a plain round
        // target that inherits the surface it sits on.
        "grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors",
        favourited
          ? "border-rose-200 bg-rose-50"
          : "border-slate-900/10 bg-white hover:bg-slate-50",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df]",
      ].join(" ")}
    >
      <AiFillHeart
        size={20}
        aria-hidden
        className="transition-colors"
        color={favourited ? "#e11d48" : "#94a3b8"}
      />
    </button>
  );
};

export default Heart;
