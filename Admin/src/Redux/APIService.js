import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "../../Config";

export const APIService = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: BACKEND_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Books", "Users"],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (user) => ({
                url: "/auth/login",
                method: "POST",
                body: user,
            }),
        }),
        fetchBooks: builder.query({
            query: () => "/books",
            providesTags: ["Books"],
        }),
        createBook: builder.mutation({
            query: (book) => ({
                url: "admin/books",
                method: "POST",
                body: book,
            }),
            invalidatesTags: ["Books"],
        }),
        editBook: builder.mutation({
            query: ({ id, ...book }) => ({
                url: `/books/${id}`,
                method: "PUT",
                body: book,
            }),
            invalidatesTags: ["Books"],
        }),
        deleteBook: builder.mutation({
            query: (id) => ({
                url: `admin/books/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Books"]
        }),
        editBook: builder.mutation({
            query: ({ id, ...book }) => {
                const formData = new FormData();
                Object.entries(book).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, value);
                    }
                });
                return {
                    url: `admin/books/${id}`,
                    method: "PUT",
                    body: formData
                };
            },
            invalidatesTags: ["Books"]
        }),
    })
});

export const {
    useLoginMutation,
    useFetchBooksQuery,
    useCreateBookMutation,
    useEditBookMutation,
    useDeleteBookMutation
} = APIService;
