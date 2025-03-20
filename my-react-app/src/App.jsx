import React from "react";
import "./index.css"; 

// Sample data (can be updated later)
const items = [
  { id: 1, name: "Item 1", description: "This is item 1" },
  { id: 2, name: "Item 2", description: "This is item 2" },
  { id: 3, name: "Item 3", description: "This is item 3" }
];

// Item component
const Item = ({ name, description }) => (
  <div>
    <h3>{name}</h3>
    <p>{description}</p>
  </div>
);

// Main App component
const App = () => {
  return (
    <div>
      <h1>Simple React List</h1>
      {items.map((item) => (
        <Item key={item.id} name={item.name} description={item.description} />
      ))}
    </div>
  );
};

export default App;

