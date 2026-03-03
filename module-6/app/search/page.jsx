"use client";

import { useSearchParams } from "next/navigation";

const SearchPage = () => {
  const searchParams = useSearchParams();

  const query = searchParams.get("q");
  const category = searchParams.get("category");
  const page = searchParams.get("page");

  const allParams = Array.from(searchParams.entries());

  console.log(allParams);

  return (
    <div>
      <h1>Search result for:{query}</h1>

      <p>category: {category}</p>
      <p>Page: {page}</p>
    </div>
  );
};

export default SearchPage;
