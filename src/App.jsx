import SplitBuilder from "./features/splits/SplitBuilder";
import {Routes, Route, Link} from "react-router-dom";

//Temporary Function
function Choice() {
  return (
    <div>
      I have it set up this way temporarily so that before we merge we can work on our own parts of the project.

      <hr/>

      <Link to ="/split" className = "links">
        Split Builder
      </Link>

      <br/>

      <Link to="/workout" className = "links">
        Workouts
      </Link>

    </div>
  );
}

function App() {
  return (
    <>
      <div>

        
        {/* You Will have to add your own route to whatever you call your file. */}
        <Routes>
          <Route path = "/" element = {<Choice/>}/>
          <Route path="/split" element={<SplitBuilder/>}/>
          
        </Routes>

      </div>
    </>
  );
}

export default App;