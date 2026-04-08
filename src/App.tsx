import "./App.css";
import {CacheingExample }from "./components/CachingExample";
import MutationExample from "./components/MutationExample";
import OptimisticQueryExample from "./components/OptimisticQueryExample";
import QueryExample from "./components/QueryExample";

function App() {
  return (
    <main>
      <QueryExample />
      <br/> 
      <MutationExample/>
      <br/>
    
      <CacheingExample/>
      <br/>
      <OptimisticQueryExample/>
    </main>
  );
}

export default App;
