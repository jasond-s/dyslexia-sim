$(function() {
    "use strict";

	function getTextNodesIn(el) {
	    return $(el).find(":not(iframe,script)").addBack().contents().filter(function() {
	        return this.nodeType == 3;
	    });
    };
 
    let textNodes = getTextNodesIn($("p.body-text"));
    let wordsInTextNodes = [];

    getWords();

	function isLetter(char) {
		return /^[\d]$/.test(char);
	}

    function getWords () {
        wordsInTextNodes = [];
        for (let i = 0; i < textNodes.length; i++) {
            let node = textNodes[i];
            let words = [];
            let re = /\w+/g;
            let match;

            while ((match = re.exec(node.nodeValue)) != null) {

                let word = match[0];
                let position = match.index;

                words.push({
                    length: word.length,
                    position: position
                });
            }

            wordsInTextNodes[i] = words;
        };
    }

	function messUpWords () {
		for (let i = 0; i < textNodes.length; i++) {
			let node = textNodes[i];

			for (let j = 0; j < wordsInTextNodes[i].length; j++) {

				// Only change a tenth of the words each round.
				if (Math.random() > 1/10) {
					continue;
				}

				let wordMeta = wordsInTextNodes[i][j];

				let word = node.nodeValue.slice(wordMeta.position, wordMeta.position + wordMeta.length);
				let before = node.nodeValue.slice(0, wordMeta.position);
				let after  = node.nodeValue.slice(wordMeta.position + wordMeta.length);

				node.nodeValue = before + messUpWord(word) + after;
			};
		};
	}

	function messUpWord (word) {
		if (word.length < 3) {			
			return word;
		}

		return word[0] + messUpMessyPart(word.slice(1, -1)) + word[word.length - 1];
	}

	function messUpMessyPart (messyPart) {
		if (messyPart.length < 2) {
			return messyPart;
		}

		let a, b;
		while (!(a < b)) {
			a = getRandomInt(0, messyPart.length - 1);
			b = getRandomInt(0, messyPart.length - 1);
		}

		return messyPart.slice(0, a) + messyPart[b] + messyPart.slice(a+1, b) + messyPart[a] + messyPart.slice(b+1);
	}

	// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
	function getRandomInt(min, max) {		
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

    setInterval(messUpWords, 50);

    const $txtBox = $('#textarea');
    
    $txtBox.keyup(function(){
        $('p.body-text').text($txtBox.val());

        textNodes = getTextNodesIn($("p.body-text"));
        getWords();
    }).trigger('keyup');
}());