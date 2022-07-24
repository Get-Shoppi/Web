import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";

const ListSettings: NextPage = () => {
  const router = useRouter();
  const listId = router.query.id as string;
  return (
    <>
      <h1>Coming Soon!</h1>
      <p className="underline" onClick={() => router.back()}>Go back</p>
    </>
  );
};

export default ListSettings;
