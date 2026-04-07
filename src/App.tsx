import "./App.css";
import {CacheingExample }from "./components/CachingExample";
import MutationExample from "./components/MutationExample";
import QueryExample from "./components/QueryExample";

function App() {
  return (
    <main>
      <QueryExample />
      <br/> 
      <MutationExample/>
      <br/>
    
      <CacheingExample/>
    </main>
  );
}

export default App;
