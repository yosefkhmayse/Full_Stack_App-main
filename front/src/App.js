import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';

// Pages
import BookList from './pages/BookList';
import AddBook from './pages/AddBook';
import EditBook from './pages/EditBook';
import Login from './pages/Login';
import Register from './pages/Register';
import UserHome from './pages/UserHome';
import AdminProfile from './pages/AdminProfile';
import UserSettings from './pages/UserSettings';
import LoanList from './pages/LoanList';
import AddLoan from './pages/AddLoan';
import EditLoan from './pages/EditLoan';
import CategoryList from './pages/CategoryList';
import AddCategory from './pages/AddCategory';
import EditCategory from './pages/EditCategory';
import BooksForCategory from './pages/BooksForCategory';
import UserList from './pages/UserList';
import AddUser from './pages/AddUser';
import EditUser from './pages/EditUser';
import AdminList from './pages/AdminList';
import AddAdmin from './pages/AddAdmin';
import EditAdmin from './pages/EditAdmin';
import AdminHome from './pages/AdminHome';
import AdminLoginPage from './pages/AdminLoginPage';
import BigAdminLoginPage from './pages/BigAdminLoginPage';
import UserLoginPage from './pages/UserLoginPage';
import BookListUser from './pages/BookListUser';
import SearchBooks from './pages/SearchBooks';
import BookDetails from './pages/BookDetails';
import UserLoans from './pages/UserLoans'; // Import the UserLoans page
import DeleteBook from './pages/DeleteBook';
import EditBookBySearch from './pages/EditBookBySearch';
import SearchByCategory from './pages/SearchByCategory';


// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NavBarAdmin from './components/NavBarAdmin';

// Context
import { useUserContext } from './context/UserContext';
import { useAdminAuth } from './context/AdminContext';
import { useBigAdminAuth } from './context/BigAdminContext';

// Layout for User
const UserLayout = () => {
  const { currentUser } = useUserContext();

  if (!currentUser) {
    return <Navigate to="/user-login" />;
  }

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

const AdminLayout = () => {
  const { currentAdmin } = useAdminAuth();

  if (!currentAdmin) {
    return <Navigate to="/admin-login" />;
  }

  return (
    <>
      <NavBarAdmin />
      <main>
        <Outlet />
      </main>
    </>
  );
};

// Layout for BigAdmin
const BigAdminLayout = () => {
  const { currentBigAdmin } = useBigAdminAuth();

  if (!currentBigAdmin) {
    return <Navigate to="/bigadmin-login" />;
  }

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

// Router Setup
const router = createBrowserRouter([
  { path: "search-book-by-id", element: <  EditBookBySearch /> },
  { path: "delete-book", element: <DeleteBook /> },
  { path: "bookdetails/:id", element: <BookDetails /> },
  { path: "search-books", element: <SearchBooks /> },
  { path: "booklist", element: <BookListUser /> },
  { path: "admin-profile", element: <AdminProfile /> },
  { path: "settings", element: <UserSettings /> },
  { path: "loans", element: <LoanList /> },
  { path: "add-loan", element: <AddLoan /> },
  { path: "edit-loan/:id", element: <EditLoan /> },
  { path: "add-user", element: <AddUser /> },
  { path: "edit-user/:id", element: <EditUser /> },
  { path: "books", element: <BookList /> },
  { path: "add", element: <AddBook /> },
  { path: "edit/:id", element: <EditBook /> },
  { path: "add-admin", element: <AddAdmin /> },
  { path: "edit-admin/:id", element: <EditAdmin /> },
  { path: "categories", element: <CategoryList /> },
  { path: "add-category", element: <AddCategory /> },
  { path: "edit-category/:id", element: <EditCategory /> },
  { path: "category", element: <BooksForCategory /> },
  { path: "users", element: <UserList /> },
  { path: "admins", element: <AdminList /> },
  { path: "userhome", element: <UserHome /> },
  { path: "userloans", element: <UserLoans /> }, 
  { path: "search-category", element: < SearchByCategory /> }, 
 
  { path: "/",
    element: <Login />,
  },
  {
    path: "/user-login",
    element: <UserLoginPage />,
  },
  {
    path: "/admin-login",
    element: <AdminLoginPage />,
  },
  {
    path: "/bigadmin-login",
    element: <BigAdminLoginPage />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/homeuser",
    element: <UserLayout />,
    children: [
     
    ],
  },
  {
    path: "/adminhome",
    element: <AdminLayout />,
    children: [
      { path: "", element: <AdminHome /> },
      { path: "books", element: <BookList /> },
      // Add other admin-related routes here
    ],
  },
  {
    path: "/bigadminhome",
    element: <BigAdminLayout />,
    children: [],
  },
]);

function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
