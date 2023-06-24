import { useEffect } from "react";

import Header from "./components/Header";
import Container from "./components/Container";
import Footer from "./components/Footer";

import {startMoralisServer} from "./services/moralis.js"
import "./App.css";

const App = () => {
  useEffect(() => {
    (async () => {
      startMoralisServer();
    })();
  }, [])

	return (
		<div id="app">
			<Header />
			<Container />
			<Footer />
		</div>
	);
}

export default App;
