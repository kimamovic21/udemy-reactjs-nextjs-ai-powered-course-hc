"use client";

import { useParams } from "next/navigation";

const ProductIdSlugPage = () => {
  const params = useParams();

  console.log(params);

  return (
    <div>
      <h1>Product Id: {params.id}</h1>
      <h2>Slug: {params.slug}</h2>
    </div>
  );
};

export default ProductIdSlugPage;
