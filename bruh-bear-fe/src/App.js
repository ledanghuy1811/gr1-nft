import Moralis from 'moralis';

import Header from "./components/Header";
import Container from "./components/Container";
import Footer from "./components/Footer";

import "./App.css";
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    (async () => {
      if (!Moralis.Core.isStarted) {
        await Moralis.start({
          apiKey: process.env.REACT_APP_MORALIS_API_KEY,
        })
      }
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
