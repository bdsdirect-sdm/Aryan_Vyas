import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddUser from './components/AddUser';
import ViewUser from './components/ViewUser';
import EditUser from './components/EditUser';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<AddUser />} />
          <Route path="/view-users" element={<ViewUser />} />
          <Route path="/edit-user/:id" element={<EditUser />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;