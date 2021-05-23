import React from 'react'
import styles from '../components/Section.module.scss';
import { cssConfig, htmlConfig, javascriptConfig, markdownConfig, postgresqlConfig, rubyConfig, sharedConfig } from './regexConfigs'
// SEE THE MARKDOWN SECTION AT THE BOTTOM FOR THE MOST BASIC GENERAL COMMENTS
export const FormatText = {
  cssDriver: function() {
    while (this.inputText.length > 0 && this.counter < 5000) {
      // "heading" is a period (class), pound sign, (id), or @
      if (this.regexConfig.heading.test(this.inputText)) {
        let headingMatchText = this.inputText.match(this.regexConfig.heading)[0]
        
        while (headingMatchText.length > 0 && this.counter < 5000) {
          if (this.regexConfig.purpleWord.test(headingMatchText)) {
            // purpleWord includes spaces and starting ./#/@
            const purpleWordMatchData = headingMatchText.match(this.regexConfig.purpleWord)
            // deal with ./#/@ and preceding spaces
            let specCharWithSpaceLength = purpleWordMatchData[0].match(this.regexConfig.selectorBeginning)[0].length

            this.formattedInputText.push(
              <span className={styles.teal}>{purpleWordMatchData[0].substring(0, specCharWithSpaceLength)}</span>
            )
            // make word purple
            this.formattedInputText.push(
              <span className={styles.purple}>{purpleWordMatchData[0].substr(specCharWithSpaceLength, purpleWordMatchData[0].length)}</span>
            )
            headingMatchText = headingMatchText.substring(purpleWordMatchData[0].length)
            this.inputText = this.inputText.substring(purpleWordMatchData[0].length)
          } else if (this.regexConfig.redWord.test(headingMatchText)) {
            const redWordMatchData = headingMatchText.match(this.regexConfig.redWord)
            this.formattedInputText.push(
              <span className={styles.redPlain}>{redWordMatchData[0]}</span>
            )
            headingMatchText = headingMatchText.substr(redWordMatchData[0].length)
            this.inputText = this.inputText.substr(redWordMatchData[0].length)
          
          } else if (this.regexConfig.specialCharacters.test(headingMatchText)) {
            const specCharMatchData = headingMatchText.match(this.regexConfig.specialCharacters)
            this.formattedInputText.push(
              <span className={styles.teal}>{specCharMatchData[0]}</span>
            )
            headingMatchText = headingMatchText.substr(specCharMatchData[0].length)
            this.inputText = this.inputText.substr(specCharMatchData[0].length)
          }
          this.counter += 1
        }

      } else if (this.regexConfig.comment.test(this.inputText)) {
        this.insertComment()
      } else if (this.regexConfig.quotes.test(this.inputText)) {
        this.insertQuotes()
      // for #fafafafa and #fff kind of color stuff
      } else if (this.regexConfig.hexColors.test(this.inputText)) {
        this.insertStyledMatch('teal', this.inputText.match(this.regexConfig.hexColors))
        
      } else if (this.regexConfig.specialCharacters.test(this.inputText)) {
        this.insertSpecialCharacters()
      // pound sign isn't in specialCharacters b/c it's shared and used for Ruby comments
      } else if (this.regexConfig.pound.test(this.inputText)) {
        this.insertStyledMatch('white', this.inputText.match(this.regexConfig.pound))
      
      } else if (this.regexConfig.insideBrackets.test(this.inputText)) {
        const insideBracketsMatchData = this.inputText.match(this.regexConfig.insideBrackets)
        //isolate everything before colon and insert it
        const beforeColonText = insideBracketsMatchData[0].match(this.regexConfig.beforeColon)
        this.insertStyledMatch('sun', beforeColonText)
      } else if (this.regexConfig.withSemicolon.test(this.inputText)) {
        // for whatever; that comes after the : inside brackets. The test function above includes the semicolon
        // the one below does not
        this.insertStyledMatch('orange', this.inputText.match(this.regexConfig.untilSemicolon))

      } else if (this.regexConfig.wordOrSpaces.test(this.inputText)) {
        this.insertStyledMatch('white', this.inputText.match(this.regexConfig.wordOrSpaces))
      } else {
        this.formattedInputText.push(<span className={styles.white}>{this.inputText}</span>)
      }
      this.counter += 1
    } // while end whole function
    return
  },

  htmlDriver: function() {
    while (this.inputText.length > 0 && this.counter < 10000) {
      if (this.regexConfig.comment.test(this.inputText)) {
        this.insertComment()

      } else if (this.regexConfig.htmlOpening.test(this.inputText)) {
        this.withinHtmlBrackets = true
        this.insertStyledMatch('teal', this.inputText.match(/^\s*</))
        // get all words and a space and turn it reddish-purple. In 'div className="farts"', it will return the 'div' portion
        const htmlWithSpaceMatch = this.inputText.match(/^(!\w+|\w+)\s/)

        if (htmlWithSpaceMatch) {
          // something like <!DOCTYPE html>
          this.insertStyledMatch('wine', htmlWithSpaceMatch)

        } else { // plain tag like <div> w/no properties
          this.insertStyledMatch('wine', this.inputText.match(/^\w+/))
          // const greaterThanMatch = this.inputText.match(this.regexConfig.greaterThan)
          // this.insertStyledMatch('teal', greaterThanMatch)
        }

      } else if (this.regexConfig.jsxProperty.test(this.inputText)) {
        // turn words purple ( whatever={} matches 'whatever')
        this.insertStyledMatch('purple', this.inputText.match(this.regexConfig.jsxPropertyText))

      } else if (this.regexConfig.quotes.test(this.inputText)) {
        this.insertQuotes()

      } else if (this.regexConfig.htmlClosing.test(this.inputText)) {
        this.withinHtmlBrackets = false
        // deal with '</'
        this.insertStyledMatch('teal', this.inputText.match(this.regexConfig.jsxClosingSlash))
        // now do the words
        this.insertStyledMatch('wine', this.inputText.match(this.regexConfig.htmlTagText))

        this.insertStyledMatch('teal', this.inputText.match(this.regexConfig.greaterThan))

      } else if (this.regexConfig.specialCharacters.test(this.inputText)) {
        const specCharMatchData = this.inputText.match(this.regexConfig.specialCharacters)
        if (this.regexConfig.greaterThan.test(specCharMatchData[0])) {
          this.withinHtmlBrackets = false
        }
        this.insertStyledMatch('teal', specCharMatchData)

      } else if (this.regexConfig.htmlWordsSpacesChars.test(this.inputText)) {
        if (this.withinHtmlBrackets) {
          this.insertStyledMatch('purple', this.inputText.match(this.regexConfig.htmlWordsSpacesChars))
        } else {
          this.insertStyledMatch('white', this.inputText.match(this.regexConfig.htmlWordsSpacesChars))
        }
      } else {
        this.formattedInputText.push(<span className={styles.white}>{this.inputText}</span>)
      }
      this.counter += 1
    } // while end for whole function
    return
  },

  javascriptDriver: function() {
    while (this.inputText.length > 0 && this.counter < 10000) {
      if (this.regexConfig.comment.test(this.inputText)) {
        this.insertComment()

      } else if (this.regexConfig.multilineCommentStart.test(this.inputText)) {
        this.insertStyledMatch('gray', this.inputText.match(this.regexConfig.multilineCommentStart))

        const multilineCommentEndMatchData = this.inputText.match(this.regexConfig.multilineCommentEnd)
        if (multilineCommentEndMatchData) {
          this.formattedInputText.push(
            <span className={styles.gray}>{this.inputText.substr(0, multilineCommentEndMatchData.index + 2)}</span>
          )
          this.inputText = this.inputText.substr(multilineCommentEndMatchData.index + 2)
        }

      } else if (this.regexConfig.reactFragmentOpening.test(this.inputText)) {
        this.insertStyledMatch('teal', this.inputText.match(this.regexConfig.reactFragmentOpening))

      } else if (this.regexConfig.reactFragmentClosing.test(this.inputText)) {
        this.insertStyledMatch('teal', this.inputText.match(this.regexConfig.reactFragmentClosing))

      } else if (this.regexConfig.jsxHtmlOpening.test(this.inputText)) {
        // We have the whole opening tag (<div className='lol whateva'>)
        // Process the '<'
        this.insertStyledMatch('teal', this.inputText.match(/^\s*</))
        // get all words and a space and turn it reddish-purple. In 'div className="farts"', it will return the 'div' portion
        const htmlWithSpaceMatch = this.inputText.match(/^\w+\s/)

        if (htmlWithSpaceMatch) {
          this.insertStyledMatch('wine', htmlWithSpaceMatch)
        } else { // plain tag like <div> w/no properties
          const htmlNoSpace = this.inputText.match(/^\w+/)
          this.insertStyledMatch('wine', htmlNoSpace)
        }

      } else if (this.regexConfig.reactComponentOpening.test(this.inputText)) {
        // Process the '<'
        this.insertStyledMatch('teal', this.inputText.match(/^\s*</))
        const htmlWithSpaceMatch = this.inputText.match(this.regexConfig.htmlTagTextSpace)

        if (htmlWithSpaceMatch) {
          this.insertStyledMatch('sun', htmlWithSpaceMatch)
        } else { // plain tag like <div> w/no properties
          this.insertStyledMatch('sun', this.inputText.match(this.regexConfig.htmlTagText))
        }

      } else if (this.regexConfig.jsxProperty.test(this.inputText)) {
        // turn words purple ( whatever={} matches 'whatever')
        this.insertStyledMatch('purple', this.inputText.match(this.regexConfig.jsxPropertyText))

      } else if (this.regexConfig.jsxHtmlClosing.test(this.inputText)) {
        // deal with '</'
        this.insertStyledMatch('teal', this.inputText.match(this.regexConfig.jsxClosingSlash))
        // now do the words
        this.insertStyledMatch('wine', this.inputText.match(this.regexConfig.htmlTagText))
        this.withinJSX = false

      } else if (this.regexConfig.reactComponentClosing.test(this.inputText)) {
        // deal with '</'
        this.insertStyledMatch('teal', this.inputText.match(/^\s*<\//))
        // now do the words
        this.insertStyledMatch('sun', this.inputText.match(/^\s*\w+/))
        this.withinJSX = false
      
      } else if (this.regexConfig.withinJsxTags.test(this.inputText) && !this.withinJSX) {
        // !this.withinJSX needed because otherwise it'll infinitely set itself to true and
        // return to the top of the loop. Make sure this is below closing tag
        this.withinJSX = true // flag for turning normal text teal
 
      } else if (this.regexConfig.variableDeclaration.test(this.inputText)) {
        // purple word
        this.insertStyledMatch('purple', this.inputText.match(this.regexConfig.constLetVar))
        // make the next work blue
        const variableMatchData = this.inputText.match(/\w*/)
        // This stupid if block is for 'for' loops so that that the 'i' (let i = 0; blah blah) isn't blue
        if (variableMatchData[0].length === 1) {
          this.insertStyledMatch('white', variableMatchData)
        } else {
          this.insertStyledMatch('blue', variableMatchData)
        }

      } else if (this.regexConfig.arrow.test(this.inputText)) {
        this.insertStyledMatch('purple', this.inputText.match(this.regexConfig.arrow))

      } else if (this.regexConfig.functionWithArgs.test(this.inputText)) {
        let functionWithArgsData = this.inputText.match(this.regexConfig.functionWithArgs)
        // remove the matched portion from matchedTextData from the beginning of this.inputText string
        if (/function/.test(functionWithArgsData[0])) {
          this.insertStyledMatch('purple', this.inputText.match(this.regexConfig.functionKeyword))
        }
        // remove outer paren we know we have and make it teal
        this.insertStyledMatch('teal', this.inputText.match(/\(/))

        // match all characters until the closing paren. Skip if parens are empty
        const argsUntilClosingParen = this.inputText.match(this.regexConfig.argsUntilClosingParen)
        if (argsUntilClosingParen) {
          let argsUntilClosingParenText = argsUntilClosingParen[0]

          while (argsUntilClosingParenText.length > 0) {
            // see of a comment will break this Matt
            if (this.regexConfig.regex.test(argsUntilClosingParenText)) {
              const regexMatchData = argsUntilClosingParenText.match(this.regexConfig.regex)
              this.insertStyledMatch('teal', regexMatchData)
              argsUntilClosingParenText = argsUntilClosingParenText.substr(regexMatchData[0].length)
  
            } else if (this.regexConfig.quotes.test(argsUntilClosingParenText)) {
              const quotesMatchData = argsUntilClosingParenText.match(this.regexConfig.quotes)
              this.insertQuotedMatch(quotesMatchData)
              argsUntilClosingParenText = argsUntilClosingParenText.substr(quotesMatchData[0].length)
  
            } else if (this.regexConfig.interpolation.test(argsUntilClosingParenText)) {
              const interpolationMatchData = argsUntilClosingParenText.match(this.regexConfig.interpolation)
              this.interpolateMatchJS(interpolationMatchData, '${', "}", '`')
              argsUntilClosingParenText = argsUntilClosingParenText.substr(interpolationMatchData[0].length)

            } else if (this.regexConfig.arrow.test(argsUntilClosingParenText)) {
              const arrowMatchData = argsUntilClosingParenText.match(this.regexConfig.arrow)
              this.insertStyledMatch('purple', arrowMatchData)
              argsUntilClosingParenText = argsUntilClosingParenText.substr(arrowMatchData[0].length)
      
            } else if (this.regexConfig.specialCharacters.test(argsUntilClosingParenText)) {
              const specCharMatchData = argsUntilClosingParenText.match(this.regexConfig.specialCharacters)
              this.insertStyledMatch('teal', specCharMatchData)
              argsUntilClosingParenText = argsUntilClosingParenText.substr(specCharMatchData[0].length)
  
            } else if (this.regexConfig.keywordsRedItalics.test(argsUntilClosingParenText)) {
              const redMatchData = argsUntilClosingParenText.match(this.regexConfig.keywordsRedItalics)
              this.insertStyledMatch('red', redMatchData)
              argsUntilClosingParenText = argsUntilClosingParenText.substr(redMatchData[0].length)

            } else if (this.regexConfig.keywordsTeal.test(argsUntilClosingParenText)) {
              const tealMatchData = argsUntilClosingParenText.match(this.regexConfig.keywordsTeal)
              this.insertStyledMatch('teal', tealMatchData)
              argsUntilClosingParenText = argsUntilClosingParenText.substr(tealMatchData[0].length)

            } else if (this.regexConfig.blueWords.test(argsUntilClosingParenText)) {
              const blueMatchData = argsUntilClosingParenText.match(this.regexConfig.blueWords)
              this.insertBlueWords(blueMatchData)
              argsUntilClosingParenText = argsUntilClosingParenText.substr(blueMatchData[0].length)
  
            } else if (this.regexConfig.wordOrSpacesOrNumbers.test(argsUntilClosingParenText)) {
              const wordOrSpacesOrNumbersMatchData = argsUntilClosingParenText.match(this.regexConfig.wordOrSpacesOrNumbers)
              this.insertStyledMatch('orange', wordOrSpacesOrNumbersMatchData)
              argsUntilClosingParenText = argsUntilClosingParenText.substr(wordOrSpacesOrNumbersMatchData[0].length)
            }
          } // while closing bracket          
        }

      } else if (this.regexConfig.regex.test(this.inputText)) {
        this.insertRegex()

      } else if (this.regexConfig.quotes.test(this.inputText)) {
        this.insertQuotes()

      } else if (this.regexConfig.interpolation.test(this.inputText)) {
        this.interpolateMatchJS(this.inputText.match(this.regexConfig.interpolation), '${', "}", '`')

      } else if (this.regexConfig.keywordsPurple.test(this.inputText)) {
        this.insertKeywordsPurple()

      } else if (this.regexConfig.keywordsRedItalics.test(this.inputText)) {
        this.insertStyledMatch('red', this.inputText.match(this.regexConfig.keywordsRedItalics))

      } else if (this.regexConfig.keywordsOrange.test(this.inputText)) {
        this.insertKeywordsOrange()

      } else if (this.regexConfig.keywordsTeal.test(this.inputText)) {
        this.insertStyledMatch('teal', this.inputText.match(this.regexConfig.keywordsTeal))

      } else if (this.regexConfig.blueWords.test(this.inputText)) {
        this.insertBlueWords(this.inputText.match(this.regexConfig.blueWords))
      
      } else if (this.regexConfig.objectLiteral.test(this.inputText)) {
        this.insertStyledMatch('teal', this.inputText.match(this.regexConfig.objectLiteral))
      
      } else if (this.regexConfig.specialCharacters.test(this.inputText)) {
        const specCharMatchData = this.inputText.match(this.regexConfig.specialCharacters)

        if (specCharMatchData[0].match(/\{/) && this.withinJSX) { // controls white text in brackets like <div>{white}</div>
          this.withinJSXBrackets = true
        } else if ((specCharMatchData[0].match(/\}/) && this.withinJSX)) {
          this.withinJSXBrackets = false
        }

        this.insertStyledMatch('teal', specCharMatchData)

      } else if (this.regexConfig.numbers.test(this.inputText)) {
        this.insertStyledMatch('orange', this.inputText.match(this.regexConfig.numbers))

      } else if (this.regexConfig.capitalLetter.test(this.inputText)) {
        const capitalLetterMatchData = this.inputText.match(this.regexConfig.capitalLetter)
        // capitalLetterPeriod is for situations like 'Array.from()'
        if (this.withinJSXBrackets && !this.regexConfig.capitalLetterPeriod.test(this.inputText)) {
          this.insertStyledMatch('white', capitalLetterMatchData)
        } else if (this.withinJSXBrackets && this.regexConfig.capitalLetterPeriod.test(this.inputText)){
          this.insertStyledMatch('sun', capitalLetterMatchData)
        } else {
          this.insertStyledMatch('teal', capitalLetterMatchData)
        }

      } else if (this.regexConfig.wordOrSpaces.test(this.inputText)) {
          if (this.withinJSX && !this.withinJSXBrackets) {
            this.insertStyledMatch('teal', this.inputText.match(this.regexConfig.wordOrSpaces))
          } else {
            this.insertStyledMatch('white', this.inputText.match(this.regexConfig.wordOrSpaces))
          }

      } else {
        this.formattedInputText.push(<span className={styles.white}>{this.inputText}</span>)
      }
      this.counter += 1
    } // while loop end
    return
  },

  /*
    ***************************************************************************
    *************************************************************************** 
    *************************************************************************** 
  */
  /*
    MARKDOWN NOTES:
    - Headings should have a space between the # signs and the text, so "# Hi", not "#Hi"
    - don't put **TEXT** or any shit in the hyperlink brackets
  */
  markdownDriver: function(inputText, newLine = true) {
    // Split along newline/carriage return characterr
    // Consider using matchGroups in the future so that we don't need
    // to add back in the stupid newline character
    let splitByNewline = inputText.split(/\r?\n/)
    let matchData = []
    let choppedText = ''
    let styling = ''

    const formattedInputText = splitByNewline.map((textSection, idx) => { // use lexical 'this'
      if (textSection == "") { return }
      textSection = textSection += "\n"
    
      // make sure this keeps the new RegExp portion. Otherwise it
      // will type-coerce into a string and be useless for .test()
      // this.regexConfig.interpolation.test(textSection)
      if (this.regexConfig.h6.test(textSection)) {
        matchData = textSection.match(new RegExp(this.regexConfig.h6))
        choppedText = this.chopBeginning(matchData, 6)
        textSection = textSection.replace(matchData[0], "\n")
        return (<h6>{this.markdownDriver(choppedText)}</h6>)

      } else if (new RegExp(this.regexConfig.h5).test(textSection)) {
        matchData = textSection.match(new RegExp(this.regexConfig.h5))
        choppedText = this.chopBeginning(matchData, 5)
        textSection = textSection.replace(matchData[0], "\n")
        return (<h5>{this.markdownDriver(choppedText)}</h5>)

      } else if (new RegExp(this.regexConfig.h4).test(textSection)) {
        matchData = textSection.match(new RegExp(this.regexConfig.h4))
        choppedText = this.chopBeginning(matchData, 4)
        textSection = textSection.replace(matchData[0], "\n")
        return (<h4>{this.markdownDriver(choppedText)}</h4>)

      } else if (new RegExp(this.regexConfig.h3).test(textSection)) {
        matchData = textSection.match(new RegExp(this.regexConfig.h3))
        choppedText = this.chopBeginning(matchData, 3)
        textSection = textSection.replace(matchData[0], "\n")
        return (<h3>{this.markdownDriver(choppedText)}</h3>)

      } else if (new RegExp(this.regexConfig.h2).test(textSection)) {
        matchData = textSection.match(new RegExp(this.regexConfig.h2))
        choppedText = this.chopBeginning(matchData, 2)
        textSection = textSection.replace(matchData[0], "\n")
        return (<h2>{this.markdownDriver(choppedText)}</h2>)
          
      } else if (new RegExp(this.regexConfig.h1).test(textSection)) {
        matchData = textSection.match(new RegExp(this.regexConfig.h1))
        choppedText = this.chopBeginning(matchData, 1)
        // matchedText includes a newline character we still need, so put it back here
        textSection = textSection.replace(matchData[0], "\n")
        return (<h1>{this.markdownDriver(choppedText)}</h1>)

      } else if (new RegExp(this.regexConfig.boldAndItalic).test(textSection)) {
        matchData = textSection.match(new RegExp(this.regexConfig.boldAndItalic))
        choppedText = this.symmetricalChop(matchData, 3)

        let origBeginning = textSection.substring(0, matchData.index)
        let origEnd = textSection.substring(matchData.index + matchData[0].length)

        return (
          <>
            {this.markdownDriver(origBeginning, false)}
              <span style={{fontWeight: 'bold', fontStyle: 'italic'}}>
                {this.markdownDriver(choppedText, false)}
              </span>
            {this.markdownDriver(origEnd, false)}
          </>
        )
      
      } else if (new RegExp(this.regexConfig.boldOrItalic).test(textSection)) {
        matchData = textSection.match(new RegExp(this.regexConfig.boldOrItalic))
        if (/\*{2}/.test(matchData[0])) {
          choppedText = this.symmetricalChop(matchData, 2)
          styling = {fontWeight: 'bold'}
        } else {
          choppedText = this.symmetricalChop(matchData, 1)
          styling = {fontStyle: 'italic'}
        }
        let origBeginning = textSection.substring(0, matchData.index)
        let origEnd = textSection.substring(matchData.index + matchData[0].length)

        return (
          <>
            {this.markdownDriver(origBeginning, false)}
              <span style={styling}>
                {this.markdownDriver(choppedText, false)}
              </span>
            {this.markdownDriver(origEnd, false)}
          </>
        )
      } else if (new RegExp(this.regexConfig.inlineCode).test(textSection)) {
        matchData = textSection.match(new RegExp(this.regexConfig.inlineCode))
        let origBeginning = textSection.substring(0, matchData.index)
        let origEnd = textSection.substring(matchData.index + matchData[0].length)
        return (
          <>
            {this.markdownDriver(origBeginning, false)}
              <span className={styles.inlineCode}>
                {this.symmetricalChop(matchData, 1)}
              </span>
            {this.markdownDriver(origEnd, false)}
          </>
        )
      } else if (new RegExp(this.regexConfig.hyperlink).test(textSection)) {
        matchData = textSection.match(new RegExp(this.regexConfig.hyperlink))
        let origBeginning = textSection.substring(0, matchData.index)
        let origEnd = textSection.substring(matchData.index + matchData[0].length)
        return (
          <>
            {this.markdownDriver(origBeginning, false)}
              {this.createHyperlink(matchData)}
            {this.markdownDriver(origEnd, false)}
          </>
        )
      } else if (new RegExp(this.regexConfig.ul).test(textSection)) {
        matchData = textSection.match(new RegExp(this.regexConfig.ul))
        let chopAmount = 0
        if (matchData[0].match(new RegExp(/\w|\d/))) {
          chopAmount = matchData[0].match(new RegExp(/\w|\d/)).index
        } else if (chopAmount = matchData[0].match(new RegExp(/\s/))) {
          // we want words or numbers before we try spaces
          chopAmount = chopAmount = matchData[0].match(new RegExp(/\s/)).index
        } else {
          return //prevents erroring out
        }
        choppedText = this.chopBeginning(matchData, chopAmount)
        textSection = textSection.replace(matchData[0], "\n")

        return (
          <ul>
            <li className={styles.fakeList}>
              {this.markdownDriver(choppedText, false)}
            </li>
          </ul>
        )
      } else {
        // return newLine ? (<p key={idx}>{textSection}</p>) : (<span key={idx}>{textSection}</span>)
        return <span key={idx}>{textSection}</span>
      }

    })
    return formattedInputText
  },

  postgresqlDriver: function() {
    while (this.inputText.length > 0 && this.counter < 10000) {
      if (this.regexConfig.comment.test(this.inputText)) {
        this.insertComment()

      } else if (this.regexConfig.quotes.test(this.inputText)) {
        this.insertQuotes()

      } else if (this.regexConfig.keywordsPurple.test(this.inputText)) {
        this.insertKeywordsPurple()

      } else if (this.regexConfig.specialCharacters.test(this.inputText)) {
        this.insertSpecialCharacters()

      } else if (this.regexConfig.numbers.test(this.inputText)) {
        this.insertStyledMatch('orange', this.inputText.match(this.regexConfig.numbers))

      } else if (this.regexConfig.wordOrSpaces.test(this.inputText)) {
        this.insertStyledMatch('white', this.inputText.match(this.regexConfig.wordOrSpaces))

      } else {
        this.formattedInputText.push(<span className={styles.white}>{this.inputText}</span>)
      }
      this.counter += 1
    } // while end
  },

  /*
    ***************************************************************************
    *************************************************************************** 
    *************************************************************************** 
  */
 rubyDriver: function() {
    while (this.inputText.length > 0 && this.counter < 10000) {
      if (this.regexConfig.comment.test(this.inputText)) {
        this.insertComment()

      } else if (this.regexConfig.rubyInterpolation.test(this.inputText)) {
        this.interpolateMatchRuby(this.inputText.match(this.regexConfig.rubyInterpolation), "#{", "}", '"')

      } else if (this.regexConfig.quotes.test(this.inputText)) {
        this.insertQuotes()
        
      } else if (this.regexConfig.regex.test(this.inputText)) {
        this.insertRegex()

      } else if (this.regexConfig.method.test(this.inputText)) {
        // make def purple and it's following space
        this.insertStyledMatch('purple', this.inputText.match(this.regexConfig.def))

        // see if we have a def self.whatever and make it red b/c I like that
          if (this.regexConfig.keywordsRedItalics.test(this.inputText)) {
          this.insertStyledMatch('red', this.inputText.match(this.regexConfig.keywordsRedItalics))
          this.formattedInputText.push(<span className={styles.teal}>{`.`}</span>)
        }
        // make the actual method name blue
        this.insertStyledMatch('blue', this.inputText.match(/\w+/))
        // make all args orange until newline, treat special characters the same
        if (!(/^\n/).test(this.inputText)) {
          const restOfTheLineMatchData = this.inputText.match(/.+/)
          const oldInputText = this.inputText
          this.methodArgs = true
          this.inputText = restOfTheLineMatchData[0]
          this.rubyDriver()
          this.methodArgs = false
          this.inputText = oldInputText.replace(restOfTheLineMatchData, "")
        }
      } else if (this.regexConfig.capitalized.test(this.inputText)) {
        this.insertStyledMatch('sun', this.inputText.match(this.regexConfig.capitalized))

      } else if (this.regexConfig.keywordsPurple.test(this.inputText)) {
        this.insertKeywordsPurple()

      } else if (this.regexConfig.keywordsRedItalics.test(this.inputText)) {
        this.insertStyledMatch('red', this.inputText.match(this.regexConfig.keywordsRedItalics))

      } else if (this.regexConfig.keywordsBlue.test(this.inputText)) {
        this.insertStyledMatch('blue', this.inputText.match(this.regexConfig.keywordsBlue))

      } else if (this.regexConfig.keywordsOrange.test(this.inputText)) {
        this.insertKeywordsOrange()

      } else if (this.regexConfig.keywordsTeal.test(this.inputText)) {
        this.insertStyledMatch('teal', this.inputText.match(this.regexConfig.keywordsTeal))

      } else if (this.regexConfig.blueWords.test(this.inputText)) {
        const blueWordUntilDotMatchData = this.inputText.match(this.regexConfig.blueWordUntilDot)
        if (blueWordUntilDotMatchData[0] !== "") { // it can match ""
          this.insertStyledMatch('blue', blueWordUntilDotMatchData)
        }
        //process the dot
        this.insertStyledMatch('teal', this.inputText.match(/\./))

        this.insertStyledMatch('blue', this.inputText.match(this.regexConfig.blueWordUntilDot))

      } else if (this.regexConfig.hashKey.test(this.inputText)) {
        const hashKeyMatchData = this.inputText.match(this.regexConfig.hashKey)

        if (/^:/.test(hashKeyMatchData[0])) { // starts with colon
          this.formattedInputText.push(<span className={styles.teal}>{`:`}</span>)
          this.formattedInputText.push(<span className={styles.orange}>{hashKeyMatchData[0].substr(1)}</span>)
        } else { // ends with colon
          this.formattedInputText.push(<span className={styles.orange}>{hashKeyMatchData[0].substr(0, hashKeyMatchData[0].length - 1)}</span>)
          this.formattedInputText.push(<span className={styles.teal}>{`:`}</span>)
        }

        this.inputText = this.inputText.substr(hashKeyMatchData.index + hashKeyMatchData[0].length)

      } else if (this.regexConfig.specialCharacters.test(this.inputText)) {
        this.insertSpecialCharacters()

      } else if (this.regexConfig.numbers.test(this.inputText)) {
        this.insertStyledMatch('orange', this.inputText.match(this.regexConfig.numbers))

      } else if (this.regexConfig.wordOrSpaces.test(this.inputText)) {
        if (this.methodArgs) {
          this.insertStyledMatch('orange', this.inputText.match(this.regexConfig.wordOrSpaces))
        } else {
          this.insertStyledMatch('white', this.inputText.match(this.regexConfig.wordOrSpaces))
        }

      } else {
        this.formattedInputText.push(<span className={styles.white}>{this.inputText}</span>)
      }
      this.counter += 1
    } // while end
  },

  css: function(inputText) {
    this.counter = 1
    this.regexConfig = {
      ...sharedConfig, 
      ...cssConfig 
    }
    this.formattedInputText = []
    this.inputText = inputText
    this.cssDriver()
    return this.formattedInputText
  },

  html: function(inputText) {
    this.counter = 1
    this.regexConfig = {
      ...sharedConfig, 
      ...htmlConfig 
    }
    this.withinHtmlBrackets = false
    this.formattedInputText = []
    this.inputText = inputText
    this.htmlDriver()
    return this.formattedInputText
  },

  // These markdownConfiguration object literals need to match 'props.type' on the
  // front end, otherwise FormatText will crash in Section.jsx
  javascript: function(inputText) {
    this.counter = 1
    this.withinJSX = false
    this.withinJSXBrackets = false
    this.regexConfig = {
      ...sharedConfig, 
      ...javascriptConfig 
    }
    this.formattedInputText = []
    this.inputText = inputText
    this.javascriptDriver()
    return this.formattedInputText
  },

  markdown: function(inputText) {
    this.formattedInputText = []
    this.regexConfig = markdownConfig
    return this.markdownDriver(inputText)
  },

  postgresql: function(inputText) {
    this.counter = 1
    this.formattedInputText = []
    this.regexConfig = {
      ...sharedConfig, 
      ...postgresqlConfig 
    }
    this.inputText = inputText
    this.postgresqlDriver()
    return this.formattedInputText
  },

  ruby: function(inputText) {
    this.counter = 1
    this.regexConfig = {
      ...sharedConfig,
      ...rubyConfig
    }
    this.methodArgs = false
    this.formattedInputText = []
    this.inputText = inputText
    this.rubyDriver()
    return this.formattedInputText
  },

  // builds a hyperlink from the main MatchData object
  createHyperlink: function(matchData) {
    const choppedLinkText = matchData[1].substring(1, matchData[1].length - 1)
    const linkURL = matchData[2].substring(1, matchData[2].length - 1)
    return (
      <a href={linkURL} target="_blank">{choppedLinkText}</a>
    )
  },

  insertBlueWords: function(blueMatchData) {
    this.inputText = this.inputText.substr(blueMatchData[0].length)
    // Need to preserve the ending '('. Remove it from matchData and then re-add the special char
    this.formattedInputText.push(
      <>
        <span className={styles.blue}>{blueMatchData[0].replace(/\(/, "")}</span>
        <span className={styles.teal}>{'('}</span>
      </>
    )
  },

  insertComment: function () {
    this.insertStyledMatch('gray', this.inputText.match(this.regexConfig.comment))
  },

  insertKeywordsOrange: function () {
    this.insertStyledMatch('orange', this.inputText.match(this.regexConfig.keywordsOrange))
  },

  insertKeywordsPurple: function () {
    this.insertStyledMatch('purple', this.inputText.match(this.regexConfig.keywordsPurple))
  },

  // push the quote, the text in the middle, and the closing quote
  insertQuotedMatch: function(quotesMatchData) { // this doesn't handle quotes that are 1 character long well
    this.inputText = this.inputText.substr(quotesMatchData.index + quotesMatchData[0].length)
    this.formattedInputText.push(
      <>
        <span className={styles.teal}>{quotesMatchData[0][0]}</span> 
        <span className={styles.green}>{quotesMatchData[0].substring(1, quotesMatchData[0].length - 1)}</span>
        <span className={styles.teal}>{quotesMatchData[0][quotesMatchData[0].length - 1]}</span>
      </>
    )
  },

  insertQuotes: function () {
    this.insertQuotedMatch(this.inputText.match(this.regexConfig.quotes))
  },

  insertRegex: function () {
    this.insertStyledMatch('teal', this.inputText.match(this.regexConfig.regex))
  },

  insertSpecialCharacters: function () {
    this.insertStyledMatch('teal', this.inputText.match(this.regexConfig.specialCharacters))
  },

  interpolateMatchJS: function(matchData, beginningTwoInterpCharacters, endInterpCharacter, enclosingCharacter) {
    let formattedEnclosingCharacter = <span className={styles.teal}>{enclosingCharacter}</span>
    // This starts at index 1 because it removes the backtick at the beginning we're about to add
    let allInterpolationText = matchData[0].substring(1, matchData[0].length)
    // Add beginning and remove it from inputText (backtick if JS)
    this.formattedInputText.push(formattedEnclosingCharacter)
    // See if there is anything between ` and ${ and then return all of that
    while (allInterpolationText.length > 0) {
      // We want one extra character after to confirm the user has not literally typed
      // `whatever ${` without the closing bracket or text to interpolate
      if (this.regexConfig.interpolationWithDollarAndBrackets.test(allInterpolationText)) {
        let textBeforeDollarMatch = allInterpolationText.match(this.regexConfig.interpolationUntilDollarBrackets)
        let greenText = textBeforeDollarMatch[0].substring(0, textBeforeDollarMatch[0].length - 2)
        // Format the text before ${ with greentext
        this.formattedInputText.push(<span className={styles.green}>{greenText}</span>)
        //remove greenText portion
        allInterpolationText = allInterpolationText.substring(greenText.length, allInterpolationText.length)
        // Add the formatted ${
        this.formattedInputText.push(<span className={styles.teal}>{beginningTwoInterpCharacters}</span>)
        // Find the text within ${ }
        let insideInterpMatch = allInterpolationText.match(this.regexConfig.insideInterpolation)
        let oldInputText = this.inputText
        // Set the inside as this.inputText. Use 2 and length - 1 because of the '${' and the '}'
        this.inputText = insideInterpMatch[0].substring(2, insideInterpMatch[0].length - 1)
        // remove it from matchWithInterpolationPortion
        allInterpolationText = allInterpolationText.substring(insideInterpMatch[0].length, allInterpolationText.length)

        this.javascriptDriver()

        this.formattedInputText.push(<span className={styles.teal}>{endInterpCharacter}</span>)
        this.inputText = oldInputText
        // see if we have trailing green text until the last enclosing character (backtick if JS) 
      } else if (this.regexConfig.interpolationUntilEnd.test(allInterpolationText)) {
        let greenTextToEndMatch = allInterpolationText.match(this.regexConfig.interpolationUntilEnd)
        // Remove all interpolation from inputText and exit out of our loop with length of zero for allInterpolationText
        this.inputText = this.inputText.substr(matchData.index + matchData[0].length)
        allInterpolationText = ''

        if (greenTextToEndMatch[0].length > 1) { // if it's just matching the enclosing character at the end, (length is 1), don't bother
          this.formattedInputText.push(
            <span className={styles.green}>{greenTextToEndMatch[0].substring(0, greenTextToEndMatch[0].length - 1)}</span>
          )
        }
        this.formattedInputText.push(formattedEnclosingCharacter) // Finish with backtick
      }
    } // while loop end
  },

  interpolateMatchRuby: function(matchData, beginningTwoInterpCharacters, endInterpCharacter, enclosingCharacter) {
    let formattedEnclosingCharacter = <span className={styles.teal}>{enclosingCharacter}</span>
    // This starts at index 1 because it removes the backtick at the beginning we're about to add
    let allInterpolationText = matchData[0].substring(1, matchData[0].length)
    // Add beginning and remove it from inputText (backtick if JS)
    this.formattedInputText.push(formattedEnclosingCharacter)
    // See if there is anything between ` and ${ and then return all of that
    while (allInterpolationText.length > 0) {
      // We want one extra character after to confirm the user has not literally typed
      // `whatever ${` without the closing bracket or text to interpolate
      if (this.regexConfig.interpolationWithPoundAndBrackets.test(allInterpolationText)) {
        let textBeforePoundMatch = allInterpolationText.match(this.regexConfig.interpolationUntilPoundBrackets)
        let greenText = textBeforePoundMatch[0].substring(0, textBeforePoundMatch[0].length - 2)
        // Format the text before ${ with greentext
        this.formattedInputText.push(<span className={styles.green}>{greenText}</span>)
        //remove greenText portion
        allInterpolationText = allInterpolationText.substring(greenText.length, allInterpolationText.length)
        // Add the formatted ${
        this.formattedInputText.push(<span className={styles.teal}>{beginningTwoInterpCharacters}</span>)
        // Find the text within ${ }
        let insideInterpMatch = allInterpolationText.match(this.regexConfig.rubyInsideInterpolation)
        let oldInputText = this.inputText
        // Set the inside as this.inputText. Use 2 and length - 1 because of the '${' and the '}'
        this.inputText = insideInterpMatch[0].substring(2, insideInterpMatch[0].length - 1)
        // remove it from matchWithInterpolationPortion
        allInterpolationText = allInterpolationText.substring(insideInterpMatch[0].length, allInterpolationText.length)

        this.rubyDriver()

        this.formattedInputText.push(<span className={styles.teal}>{endInterpCharacter}</span>)
        this.inputText = oldInputText
        // see if we have trailing green text until the last enclosing character (backtick if JS) 
      } else if (this.regexConfig.rubyInterpolationUntilEnd.test(allInterpolationText)) {
        let greenTextToEndMatch = allInterpolationText.match(this.regexConfig.rubyInterpolationUntilEnd)
        // Remove all interpolation from inputText and exit out of our loop with length of zero for allInterpolationText
        this.inputText = this.inputText.substr(matchData.index + matchData[0].length)
        allInterpolationText = ''

        if (greenTextToEndMatch[0].length > 1) { // if it's just matching the enclosing character at the end, (length is 1), don't bother
          this.formattedInputText.push(
            <span className={styles.green}>{greenTextToEndMatch[0].substring(0, greenTextToEndMatch[0].length - 1)}</span>
          )
        }
        this.formattedInputText.push(formattedEnclosingCharacter) // Finish with backtick
      }
    } // while loop end
  },

  insertStyledMatch: function(styleClass, matchedTextData) {
    // remove the matched portion from matchedTextData from the beginning of this.inputText string
    this.inputText = this.inputText.substr(matchedTextData.index + matchedTextData[0].length)
    // add formatted match w/className from matchedTextData
    this.formattedInputText.push(<span key={this.counter} className={styles[styleClass]}>{matchedTextData[0]}</span>)
  },
  // lops off the beginning of the inputted text.
  // '### Title' becomes 'Title' if the amount is 3
  chopBeginning: function(matchData, amount) {
    return matchData[0].substr(amount)
  },
  // lops off the beginning and end. 
  // '**hello world**' becomes 'hello world' if the amount is 2. 
  symmetricalChop: function(matchData, amount) {
    return matchData[0].substring(amount, matchData[0].length - amount)
  },
}