document.addEventListener("DOMContentLoaded", () => {
  createSquares();
  getWord();

  const guessedWords = [[]];
  let availableSpace = 1;
  let canDel = false;
  let word;
  let guessedWordCount = 0;

  const keys = document.querySelectorAll(".keyboard-row button");

  async function getWord() {
    const url =
      "https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=6&lettersMax=6";
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "64231d94c1mshb11ee31143a91d0p1f3b13jsnd83de9b14811",
        "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
      },
    };
    try {
      const response = await fetch(url, options);
      const result = await response.text();
      word = JSON.parse(result).word;
    } catch (error) {
    }
  }

  function getCurrentWordArr() {
    const numOfGuessed = guessedWords.length;
    return guessedWords[numOfGuessed - 1];
  }

  function updateGuessedWords(letter) {
    const currentWordArr = getCurrentWordArr();

    if (currentWordArr && currentWordArr.length < 6) {
      currentWordArr.push(letter);

      let availableSpaceEle = document.getElementById(String(availableSpace));
      availableSpace += 1;
      availableSpaceEle.textContent = letter;
      canDel = currentWordArr.length <= 0 ? false : true;
    }
  }

  function createSquares() {
    const gameBoard = document.getElementById("board");

    for (let index = 0; index < 36; index++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.classList.add("animate__animated");
      square.setAttribute("id", index + 1);
      gameBoard.appendChild(square);
    }
  }

  function getTileColor(letter, index) {
    const isCorrect = word.includes(letter);

    if (!isCorrect) {
      let wrongLetter = document.getElementById(letter);
      wrongLetter.style.backgroundColor = 'rgb(58, 58, 60)';
      return "rgb(58, 58, 60)";
    }

    const letterInIndex = word.charAt(index);
    const isCorrectIndex = letter === letterInIndex;

    if (isCorrectIndex) {
      let correctLetter = document.getElementById(letter);
      correctLetter.style.backgroundColor = 'rgb(83, 141, 78)';
      return "rgb(83, 141, 78)";
    }

    let correctLetter = document.getElementById(letter);
    correctLetter.style.backgroundColor = 'rgb(181, 159, 59)';
    return "rgb(181, 159, 59)";
  }

  async function handleSubmit() {
    const currentWordArr = getCurrentWordArr();
    if (currentWordArr.length !== 6) {
      window.alert("Word must be 6 letters.");
      return;
    }

    const currentWord = currentWordArr.join("");

    const url = `https://wordsapiv1.p.rapidapi.com/words/${currentWord}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "64231d94c1mshb11ee31143a91d0p1f3b13jsnd83de9b14811",
        "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      let attempt = JSON.parse(result);
      if (attempt.hasOwnProperty('success')) {
        throw Error();
      }

      const firstLetterId = guessedWordCount * 6 + 1;
      const interval = 200;
      currentWordArr.forEach((letter, index) => {
        setTimeout(() => {
          const tileColor = getTileColor(letter, index);
          const letterId = firstLetterId + index;
          const letterEle = document.getElementById(letterId);
  
          letterEle.classList.add("animate__flipInX");
          letterEle.style = `background-color: ${tileColor}; border-color:${tileColor}`;
        }, interval * index);
      });
  
      if (currentWord === word) {
        window.alert("Congratulations! You found the word");
        return;
      }
  
      if (guessedWords.length === 6) {
        window.alert(`Sorry no more guesses, the word is ${word}.`);
      }
  
      guessedWords.push([]);
      guessedWordCount += 1;
    }  catch (error) {
      window.alert('Word is not recognized');
    } 


  }

  function handleDel() {
    const currentWordArr = getCurrentWordArr();
    const removedLetter = currentWordArr.pop();

    if (!canDel) {
      return;
    }
    guessedWords[guessedWords.length - 1] = currentWordArr;

    const lastLetterEle = document.getElementById(String(availableSpace - 1));
    lastLetterEle.textContent = "";
    availableSpace -= 1;
    canDel = currentWordArr.length <= 0 ? false : true;
  }

  for (let index = 0; index < keys.length; index++) {
    keys[index].onclick = ({ target }) => {
      const key = target.getAttribute("data-key");

      if (key === "enter") {
        handleSubmit();
        return;
      }

      if (key === 'del') {
        handleDel();
        return;
      }

      updateGuessedWords(key);
    };
  }

  document.addEventListener('keydown', function(event) {
    let keyPressed = event.key;
    if (/^[a-zA-Z]$/.test(keyPressed)) {
      updateGuessedWords(keyPressed);
    }

    if (keyPressed === 'Enter') {
      handleSubmit();
      return;
    }

    if (keyPressed === 'Backspace' || keyPressed === 'Delete') {
      handleDel();
      return;
    }

  })

});
