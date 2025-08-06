import * as React from 'react';
import { Routes, Route, Outlet, Link } from 'react-router-dom';
import Base from './features/Basic';
import CustomPayload from './features/CustomPayload';
import Tokenization from './features/Tokenization';
import SubmitHandling from './features/SubmitHandling';
import Cmp from './features/Cmp';

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
        <Link to='/cmp'>Card Management Integration</Link>
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
