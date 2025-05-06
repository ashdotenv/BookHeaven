import React, { useState } from 'react';
import { useFetchBooksQuery, useCreateBookMutation, useDeleteBookMutation, useEditBookMutation } from '../Redux/APIService';

const initialForm = {
  title: '',
  author: '',
  description: '',
  price: '',
  stock: '',
  image: null,
  genre: '',
  language: '',
  format: '',
  publisher: '',
  isbn: '',
  publicationDate: '',
  ratings: '',
  ratingsCount: '',
  isPhysicalAvailable: false,
  soldCount: '',
};

const Books = () => {
  const { data: books, isLoading, isError, error } = useFetchBooksQuery();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [createBook, { isLoading: isCreating, error: createError }] = useCreateBookMutation();
  const [deleteBook] = useDeleteBookMutation();
  const [editBook, { isLoading: isEditing }] = useEditBookMutation();
  const [formError, setFormError] = useState('');
  const [editMode, setEditMode] = useState(false);

  const handleUpdate = (book) => {
    setForm({
      ...initialForm,
      ...book,
      image: null,
      genre: Array.isArray(book.genre) ? book.genre.join(', ') : book.genre,
      publicationDate: book.publicationDate ? book.publicationDate.split('T')[0] : '',
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      await deleteBook(id);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const formData = new FormData();
    formData.append('Title', form.title);
    formData.append('Author', form.author);
    formData.append('Description', form.description);
    formData.append('Price', form.price);
    formData.append('Stock', form.stock);
    if (form.image) formData.append('Image', form.image);
    formData.append('Genre', form.genre.split(',').map(g => g.trim()));
    formData.append('Language', form.language);
    formData.append('Format', form.format);
    formData.append('Publisher', form.publisher);
    formData.append('ISBN', form.isbn);
    formData.append('PublicationDate', form.publicationDate);
    formData.append('IsPhysicalAvailable', form.isPhysicalAvailable);
    try {
      await createBook(formData).unwrap();
      setShowModal(false);
      setForm(initialForm);
    } catch (err) {
      setFormError(err?.data?.message || 'Failed to add book');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await editBook({ id: form.id, ...form }).unwrap();
      setShowModal(false);
      setForm(initialForm);
      setEditMode(false);
    } catch (err) {
      setFormError(err?.data?.message || 'Failed to update book');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else if (type === 'file') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleGenreChange = (e) => {
    setForm({ ...form, genre: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const formData = new FormData();
    formData.append('Title', form.title);
    formData.append('Author', form.author);
    formData.append('Description', form.description);
    formData.append('Price', form.price);
    formData.append('Stock', form.stock);
    if (form.image) formData.append('Image', form.image);
    formData.append('Genre', form.genre.split(',').map(g => g.trim()));
    formData.append('Language', form.language);
    formData.append('Format', form.format);
    formData.append('Publisher', form.publisher);
    formData.append('ISBN', form.isbn);
    formData.append('PublicationDate', form.publicationDate);
    formData.append('Ratings', form.ratings);
    formData.append('RatingsCount', form.ratingsCount);
    formData.append('IsPhysicalAvailable', form.isPhysicalAvailable);
    formData.append('SoldCount', form.soldCount);
    try {
      await createBook(formData).unwrap();
      setShowModal(false);
      setForm(initialForm);
    } catch (err) {
      setFormError(err?.data?.message || 'Failed to add book');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Books List</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add Book</button>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-base-100 p-8 rounded-lg shadow-lg w-full max-w-3xl relative">
            <button className="absolute top-2 right-2 btn btn-sm btn-circle" onClick={() => { setShowModal(false); setEditMode(false); }}>✕</button>
            <h3 className="text-xl font-bold mb-4">{editMode ? 'Edit Book' : 'Add New Book'}</h3>
            <form onSubmit={editMode ? handleEditSubmit : handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <input className="input input-bordered w-full" name="title" value={form.title} onChange={handleInputChange} placeholder="Title" required />
                <input className="input input-bordered w-full" name="author" value={form.author} onChange={handleInputChange} placeholder="Author" />
                <textarea className="textarea textarea-bordered w-full" name="description" value={form.description} onChange={handleInputChange} placeholder="Description" />
                <input className="input input-bordered w-full" name="price" type="number" value={form.price} onChange={handleInputChange} placeholder="Price" />
                <input className="input input-bordered w-full" name="stock" type="number" value={form.stock} onChange={handleInputChange} placeholder="Stock" />
                <input className="file-input file-input-bordered w-full" name="image" type="file" accept="image/*" onChange={handleInputChange} />
                <input className="input input-bordered w-full" name="genre" value={form.genre} onChange={handleGenreChange} placeholder="Genre (comma separated)" />
              </div>
              <div className="space-y-3">
                <input className="input input-bordered w-full" name="language" value={form.language} onChange={handleInputChange} placeholder="Language" />
                <input className="input input-bordered w-full" name="format" value={form.format} onChange={handleInputChange} placeholder="Format" />
                <input className="input input-bordered w-full" name="publisher" value={form.publisher} onChange={handleInputChange} placeholder="Publisher" />
                <input className="input input-bordered w-full" name="isbn" value={form.isbn} onChange={handleInputChange} placeholder="ISBN" />
                <input className="input input-bordered w-full" name="publicationDate" type="date" value={form.publicationDate} onChange={handleInputChange} placeholder="Publication Date" />
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="checkbox" name="isPhysicalAvailable" checked={form.isPhysicalAvailable} onChange={handleInputChange} />
                  Physical Available
                </label>
                <label className="label">Discount Price</label>
                <input type="number" step="0.01" className="input input-bordered w-full" name="discountPrice" value={form.discountPrice || ''} onChange={handleInputChange} />
                <label className="label">Discount Start</label>
                <input type="datetime-local" className="input input-bordered w-full" name="discountStart" value={form.discountStart || ''} onChange={handleInputChange} />
                <label className="label">Discount End</label>
                <input type="datetime-local" className="input input-bordered w-full" name="discountEnd" value={form.discountEnd || ''} onChange={handleInputChange} />
              </div>
              <div className="col-span-1 md:col-span-2">
                {formError && <div className="text-error text-sm mb-2">{formError}</div>}
                <button className="btn btn-primary w-full" type="submit" disabled={isCreating || isEditing}>{isCreating || isEditing ? (editMode ? 'Saving...' : 'Adding...') : (editMode ? 'Save Changes' : 'Add Book')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {(!books || books.length === 0) ? (
        <div>No books found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Actions</th>
                <th>Image</th>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>ISBN</th>
                <th>Language</th>
                <th>Price</th>
                <th>Publication Date</th>
                <th>Publisher</th>
                <th>Ratings</th>
                <th>Ratings Count</th>
                <th>Sold Count</th>
                <th>Stock</th>
                <th>Format</th>
                <th>Physical?</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {books.books.map((book) => (
                <tr key={book.id}>
                  <td>
                
                    <button className="btn btn-xs btn-warning mr-2" onClick={() => handleUpdate(book)}>Edit</button>
                    <button className="btn btn-xs btn-error" onClick={() => handleDelete(book.id)}>Delete</button>
                  </td>
                  <td><img src={`https://localhost:7018/${book.image}`} alt={book.title} className="w-16 h-20 object-cover rounded" /></td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{Array.isArray(book.genre) ? book.genre.join(', ') : book.genre}</td>
                  <td>{book.isbn}</td>
                  <td>{book.language}</td>
                  <td>${book.price}</td>
                  <td>{book.publicationDate ? new Date(book.publicationDate).toLocaleDateString() : ''}</td>
                  <td>{book.publisher}</td>
                  <td>{book.ratings}</td>
                  <td>{book.ratingsCount}</td>
                  <td>{book.soldCount}</td>
                  <td>{book.stock}</td>
                  <td>{book.format}</td>
                  <td>{book.isPhysicalAvailable ? 'Yes' : 'No'}</td>
                  <td>{book.createdAt ? new Date(book.createdAt).toLocaleString() : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Books;