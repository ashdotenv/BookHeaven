import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "../../Config";

export const APIService = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7018/api",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (user) => ({
        url: "/auth/register",
        method: "POST",
        body: user,
      }),
    }),
    login: builder.mutation({
      query: (user) => ({
        url: "/auth/login",
        method: "POST",
        body: user,
      }),
    }),
    getBooks: builder.query({
      query: (params) => {
        // Only include non-null params
        const queryString = Object.entries(params || {})
          .filter(([_, v]) => v !== null && v !== undefined && v !== "")
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
          .join("&");
        return `/books${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Books"],
      transformResponse: (response) => {
        if (Array.isArray(response)) {
          return { books: response };
        }
        return response;
      },
    }),
    getBookById: builder.query({
      query: (id) => `/books/${id}`,
      providesTags: ["Books"],
    }),
    // Bookmarks
    getBookmarks: builder.query({
      query: (userId) => `/user/${userId}/bookmark`,
      providesTags: ["Bookmarks"],
    }),
    addToBookmark: builder.mutation({
      query: ({ userId, bookId }) => ({
        url: `/user/${userId}/bookmark/add/${bookId}`,
        method: "POST",
      }),
      invalidatesTags: ["Bookmarks"],
    }),
    removeFromBookmark: builder.mutation({
      query: ({ userId, bookId }) => ({
        url: `/user/${userId}/bookmark/remove/${bookId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bookmarks"],
    }),
    // Cart
    addToCart: builder.mutation({
      query: ({ userId, bookId }) => ({
        url: `/user/${userId}/cart/add/${bookId}`,
        method: "POST",
      }),
      invalidatesTags: ["Users"],
    }),
    removeFromCart: builder.mutation({
      query: ({ userId, bookId }) => ({
        url: `/user/${userId}/cart/remove/${bookId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    getCartItems: builder.query({
      query: (userId) => `/user/${userId}/cart`,
      providesTags: ["Users"],
    }),
    placeOrder: builder.mutation({
      query: (order) => ({
        url: "/orders",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["Users"],
    }),
    getMyOrders: builder.query({
      query: () => "/orders/my-orders",
      providesTags: ["Users"],
    }),
    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: ["Users"],
    }),
    getActiveBanner: builder.query({
      query: () => "/banner/active",
    }),
  }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useGetBooksQuery,
    useGetBookByIdQuery,
    useGetBookmarksQuery,
    useAddToBookmarkMutation,
    useRemoveFromBookmarkMutation,
    useAddToCartMutation,
    useRemoveFromCartMutation,
    useGetCartItemsQuery,
    usePlaceOrderMutation,
    useGetMyOrdersQuery,
    useCancelOrderMutation,
    useGetActiveBannerQuery,
} = APIService;
