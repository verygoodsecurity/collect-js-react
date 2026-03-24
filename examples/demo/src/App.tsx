import * as React from 'react';
import { Link, Outlet, Route, Routes } from 'react-router-dom';
import Base from './features/Basic';
import CustomPayload from './features/CustomPayload';
import Tokenization from './features/Tokenization';
import SubmitHandling from './features/SubmitHandling';
import Cmp from './features/Cmp';
import CmpUpdateCard from './features/CmpUpdateCard';

export default function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Base />} />
          <Route path='/custom-payload' element={<CustomPayload />} />
          <Route path='/tokenization-api' element={<Tokenization />} />
          <Route path='/submit-handling' element={<SubmitHandling />} />
          <Route path='/cmp' element={<Cmp />} />
          <Route path='/cmp-update-card' element={<CmpUpdateCard />} />
          <Route path='*' element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
}

function Layout() {
  return (
    <>
      <nav className='menu'>
        <Link to='/'>Basic</Link>
        <Link to='/custom-payload'>Custom Payload</Link>
        <Link to='/tokenization-api'>Tokenization API</Link>
        <Link to='/submit-handling'>Submit Handling</Link>
        <Link to='/cmp'>Card Management (Create Card)</Link>
        <Link to='/cmp-update-card'>Card Management (Update Card)</Link>
      </nav>
      <hr />
      <main className='container'>
        <Outlet />
      </main>
    </>
  );
}

function NoMatch() {
  return (
    <>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to='/'>Go to the home page</Link>
      </p>
    </>
  );
}
