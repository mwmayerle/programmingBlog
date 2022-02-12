import React from 'react'
import styles from './Root.module.scss'

const HomePageEntry = () => {
  return (
    <div className={styles.notLoggedInMainPage}>
      <br />
      <h1>What is this thing I have found?</h1>
      <div>
        <p>
        <i className={styles.codeEditorBackground}>
          <span className={styles.red}>this</span><span className={styles.teal}>.</span><span className={styles.blue}>killMe</span><span className={styles.teal}>(); </span>
        </i>
          &nbsp; is my own personal blog/learning tool that I wrote to help me not be bad at my job and continue to learn. It summarizes various books/videos without citing them. 
          As an added bonus I have no academic computer science background. It is clearly a wealth of highly trusted information that you should blindly believe at face value without question.
        </p>
      </div>
      <div>
        <h2>Why didn't you use a blog template?</h2>
        <div>
          <p>
            I learn best when I write things down. Unfortunately, coding is a pretty shit topic in the "write on a piece of paper"-style of notetaking I prefer. 
            I wanted to write and then have what I have written autoformatted so that I'm not dicking around with divs and spans forever. Unfortunately, as you can probably tell from looking at this homepage,
            styling and design are not my strong points. Additionally, when you import everything for your project despite the imports usually being superior and tested, you don't learn nearly as much.
            I believe there is an over-emphasis on creating unique side-projects because it still takes skill to figure out a way to clone an existing application and achieve similar functionality,
            and this blog managed to do what all generic blogs do (love writing sentences that are a complete lie like that, I've only seen maybe 4) but better. Without lying I can say that my code-formatter
            does a better job than Gitlab's code formatter, although Gitlab's is probably far less of a bloated whore.
          </p>
        </div>
      </div>
      <div>
        <h2>So how does this work?</h2>
        <p>
          The whole blog has a Topic model, which is what is in the navbar at the top, and each topic has an associated Post model, 
          which appears in the navbar on the left if you were to click on a topic and said topic actually has posts. 
          Each post is composed of Sections, which have a position integer attribute, body string, a type, and other irrelevant crap you don't care about. Sections in each post are sorted numerically.
          When post is selected and the page loads, the Post's body string is run through a gauntlet of regular expressions. The regex has a hierarchy of matches and uses whatever the first
          match that it finds is. For example, something like "44 years ago" (pretend that's a literal string and not me quoting something) will have finding a string above finding a random number in the hierarchy.
          When a match is found, it is removed from the original string, gets spitroasted by some span tags with a color class, and then shoveled into an array of "formatted text".
          This process continues until the original string is empty or a safety counter I added hits 10000. The formatted strings are then thrown into a div and designed to look like
          like an extension or whatever for VS Code I downloaded called "Boxy Ocean (dimmed bg)". 
          There are also Tags, which are used to dump any posts that have the same tag regardless of topic in the links at the bottom of the page.
        </p>
        <p>
          Unless you're on the homepage (which is this page), everything you see will be a Post consisting of Sections.
        </p>
      </div>
      <div>
        <h2>So what can it actually do?</h2>
        <p>
          All posts you see will have sections that default to what I call "watered-down imitation markdown". The imitation markdown does most of the basic formatting you expect, including creating hyperlinks and lists.
          Some compromises were made (lists can only start with a dash) and it can misbehave sometimes, but usually it works.
          It doesn't do image uploads or anything, but this is free-tier trash I'm using so that shouldn't be surprising. The markdown algorithm is recursive for zero benefit and I don't know
          why I did that.
        </p>
        <p>
          This blog will auto-format several types of codeblock. They <i>mostly</i> will end up looking correct, but there are exceptions. They look very similar to what you would see in VS Code
          with the "Boxy Ocean (dimmed bg)" theme I blatantly ripped off. This blog will format but not run code blocks of the following:
        </p>
        <p>
          - Ruby
          <br />
          - Javascript
          <br />
          - JSX and HTML (really)
          <br />
          - Postgresql
          <br />
          - CSS
          <br />
          - Markdown
        </p>
        <p>
          And again, I can say with confidence the end result is better than what Gitlab's code review section can do in the formatting department (in non-markdown), although Gitlab has an order or two of magnitude more features.
          You can also click and drag post sections to reorder them, and they can be edited/deleted individually for the inevitable typo, omission of a critical word, or other mistakes that I am prone to making while writing.
        </p>
      </div>
      <div>
        <h2>What can it not do?</h2>
        <p>
          So I was going to add support for images, but then I decided uploading images into the asset pipeline, AWS, ActiveStorage, etc would be even more
          overkill than this entire blog is from the get go, and from what I've read storing a blob as a string in the database is very not recommended.
          Perhaps this will be revisited in the future.
        </p>
      </div>
      <div>
        <h2>What are your plans for this?</h2>
        <p>
          To write something, patch a bug, or add a feature every weekday that isn't Friday and once on the weekend (lol that'll totally happen).
          Unfortunately now that this is mostly complete I cannot put off doing real work :(
        </p>
        <br />
        <p>
          Thanks for stopping by,
          <br />
          Matt
        </p>
      </div>
    </div>
  )
}

export default HomePageEntry;