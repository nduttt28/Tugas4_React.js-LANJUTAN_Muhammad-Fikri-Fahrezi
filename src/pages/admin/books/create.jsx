import { useEffect, useState } from "react";
import { getGenres } from "../../../_services/genres";
import { getAuthors } from "../../../_services/authors";
import { useNavigate } from "react-router-dom";
import { createBook } from "../../../_services/books";

export default function BookCreate() {
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    price: 0,
    stock: 0,
    genre_id: 0,
    author_id: 0,
    cover_photo: null,
    description: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [genresData, authorsData] = await Promise.all([
        getGenres(),
        getAuthors(),
      ]);
      setGenres(genresData);
      setAuthors(authorsData);
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "cover_photo") {
      setFormData({
        ...formData,
        cover_photo: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      for (const key in formData) {
        payload.append(key, formData[key]);
      }

      await createBook(payload);
      navigate("/admin/books");
    } catch (error) {
      console.log(error);
      alert("Error creating book");
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
          Create New Book
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Book Title"
              required
              className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 
                         focus:ring-indigo-600 focus:border-indigo-600 dark:bg-gray-700 dark:border-gray-600 
                         dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 150000"
                required
                className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 
                           focus:ring-indigo-600 focus:border-indigo-600 dark:bg-gray-700 dark:border-gray-600 
                           dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="stock" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Stock
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="e.g. 1"
                required
                className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 
                           focus:ring-indigo-600 focus:border-indigo-600 dark:bg-gray-700 dark:border-gray-600 
                           dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Genre & Author */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="genre_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Genre
              </label>
              <select
                id="genre_id"
                name="genre_id"
                value={formData.genre_id}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 
                           focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 
                           dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
              >
                <option value="">--select genre--</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>{genre.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="author_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Author
              </label>
              <select
                id="author_id"
                name="author_id"
                value={formData.author_id}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 
                           focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 
                           dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
              >
                <option value="">--select author--</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>{author.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cover Photo */}
          <div>
            <label htmlFor="cover_photo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Cover Photo
            </label>
            <input
              type="file"
              id="cover_photo"
              name="cover_photo"
              accept="image/*"
              onChange={handleChange}
              required
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer 
                         bg-gray-50 dark:text-gray-400 focus:outline-none
                         file:bg-black file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 
                         hover:file:bg-gray-800"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              placeholder="Write a description of the book..."
              className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 
                         focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 
                         dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-700 rounded-lg 
                         hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 
                         dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
            >
              Create Book
            </button>
            <button
              type="reset"
              className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-600 rounded-lg 
                         hover:bg-gray-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 
                         dark:border-gray-500 dark:text-gray-500 dark:hover:bg-gray-600 dark:hover:text-white 
                         dark:focus:ring-gray-900"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
