import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import ViewProduct from './components/ViewProduct';
import NotFound from './components/NotFound';
import EditProduct from './components/EditProduct';
import ProtectedRoute from './components/ProtectedRoute';
import FrontPage from "./components/FrontPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage/>}/> 
        <Route path="/registration-page" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route 
          path="/products" 
          element={
            <ProtectedRoute>
              <ProductList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/products/add" 
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/products/:id" 
          element={
            <ProtectedRoute>
              <ViewProduct />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/products/edit/:id" 
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
