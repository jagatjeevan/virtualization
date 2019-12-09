import React, { useState } from "react";
import "./App.scss";

const createData = (noOfItem, heightOfItem) => {
  let position = 0;
  let items = {};
  for (let i = 0; i < noOfItem; i++) {
    items[position] = {
      displayName: i
    };
    position += heightOfItem;
  }
  return items;
};

const GetContent = props => {
  const { scrollingPosition, items } = props;
  let startingLimit = scrollingPosition - 450;
  let endingLimit = scrollingPosition + 450;

  const itemsToShow = Object.keys(items).filter(
    item => item < endingLimit && item > startingLimit
  );

  return itemsToShow.map(item => {
    const obj = items[item];
    const displayName = obj.displayName;
    return (
      <div
        className="some-content"
        style={{ top: `${item}px` }}
        id={item}
        key={item}
      >
        item{displayName}
      </div>
    );
  });
};

const GetContentMemoised = React.memo(GetContent);

const App = () => {
  const [scrollingPosition, setScrollingPosition] = useState(0);
  const heightOfItem = 40;
  const noOfItem = 12000;
  const items = createData(noOfItem, heightOfItem);
  let timer = null;

  const getHeight = () => {
    const height = heightOfItem * noOfItem;
    return `${height}px`;
  };

  const fetchData = () => {
    const mainContainerScrollTop = document.querySelector("#mainContainer")
      .scrollTop;
    setScrollingPosition(mainContainerScrollTop);
    clearTimeout(timer);
  };

  const handleScroll = () => {
    if (timer === null) {
      timer = setTimeout(fetchData, 150);
    }
  };

  return (
    <div className="main-contanier">
      <h2>
        <u>Virtualizing DOM:</u>
      </h2>
      <p>
        If you have a longer list to display, it would be very costly to dump
        all the data to DOM as the browser have to do a lot of work to put it on
        DOM like having all the styles, attach event listener. The DOM may hang
        if the data is quite huge.
      </p>
      <p>
        You can inspect the element of list and check how the dom only changes
        the ones which are changing keeping the DOM elements same. In this
        example, we have used React memoisation to be more performant.
      </p>
      <div
        className="scroll-container"
        id="mainContainer"
        onScroll={handleScroll}
      >
        <div
          className="some-content-container"
          id="someContentContainer"
          style={{ height: getHeight() }}
        >
          <GetContentMemoised
            items={items}
            scrollingPosition={scrollingPosition}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
