import Head from "next/head";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

function PostList({ meta, posts, query }) {
  const [displayPosts, setDisplayPosts] = useState(posts);
  const totalPage = meta.pagination.totalPages;
  const [pageSekarang, setPageSekarang] = useState(meta.pagination.page);

  const router = useRouter();

  const { sort } = query;

  const [newMenu, setNewMenu] = useState(
    sort === undefined || sort === "new" ? 1 : 0
  );

  const loadMore = async () => {
    setPageSekarang((pageSekarang) => pageSekarang + 1);

    const response = await fetch(
      `https://hsi-sandbox.vercel.app/api/articles?page=${pageSekarang + 1}${
        sort === undefined ? `` : `&sort=${sort}`
      }`
    );
    const { data } = await response.json();

    setDisplayPosts([...displayPosts, ...data]);
  };

  const btnNewClick = () => {
    router.replace("/?sort=new");
    router.reload();
  };

  const btnPopularClick = () => {
    router.push("/?sort=popular");
    router.reload();
  };

  return (
    <>
      <Head>
        <title>Ujian HSI Level 3</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div className="body-content">
          <div className="row-satu">
            <div className="col-satu-row-satu">
              <button
                className={`${newMenu === 0 ? "btn-aktif" : "btn-non-aktif"}`}
                type="button"
                onClick={btnPopularClick}
              >
                Popular
              </button>
            </div>
            <div className="col-dua-row-satu">
              <button
                className={`${newMenu === 1 ? "btn-aktif" : "btn-non-aktif"}`}
                type="button"
                onClick={btnNewClick}
              >
                New
              </button>
            </div>
            <div className="col-tiga-row-satu">
              {" "}
              <Image
                src="/logo.png"
                width={99}
                height={29}
                alt="Picture of the author"
              />
            </div>
            <div className="col col-dua-row-satu"></div>
          </div>

          {displayPosts.map((post) => {
            return (
              <div key={post.id}>
                <div className="row-dua">
                  <div className="col-satu-row-dua">
                    <img className="card" src={post.thumbnail}></img>
                  </div>
                  <div className="col-dua-row-dua">
                    {" "}
                    <div>
                      <span className="abu">By </span>
                      <span className="hitam">
                        {post.author.firstName} {post.author.lastName}{" "}
                      </span>
                      <span className="abu">in</span>{" "}
                      <span className="hitam">{post.category.name}</span>
                    </div>
                  </div>
                  <div className="col-tiga-row-dua">
                    <Link
                      href={{
                        pathname: "/[slug]",
                        query: {},
                      }}
                      as={`/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="row-tiga">
            {" "}
            <button
              onClick={loadMore}
              className={`btn-load-more ${
                pageSekarang === totalPage ? "hidden" : ""
              }`}
              type="button"
            >
              Load More
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default PostList;

export async function getServerSideProps(context) {
  const { resolvedUrl, query } = context;
  const response = await fetch(
    `https://hsi-sandbox.vercel.app/api/articles${resolvedUrl}`
  );
  const { meta, data } = await response.json();
  return {
    props: {
      meta,
      posts: data,
      query,
    },
  };
}
