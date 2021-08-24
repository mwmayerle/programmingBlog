import React from 'react'
import styles from './Section.module.scss';
import { FormatText } from '../utilities/formatText.js'

const Section = props => {
  const [previewingSection, setPreviewingSection] = React.useState(false)
  const formattedText = previewingSection ? FormatText[props.type](props.body) : <></>

  return (
    props.editingPost ? (
      <div key={`${props.id}-editing`}>
        <div 
          className={styles.formRow}
          id={props.id}
          data-position={props.position}
          draggable={props.editingPost ? "true" : null}
          onDragStart={props.handleDragStart}
          onDragOver={props.handleDragOver}
          onDrop={props.handleDrop}
          style={{cursor:'grabbing'}}
        >
          <label
            data-position={props.position}
          >
            Section Type:
          </label>
          <select
            defaultValue={props.type}
            id={props.id}
            onChange={(event) => props.handleSectionChange(event, 'section_type')}
            required
          >
            <option value="ruby">Ruby</option>
            <option value="javascript">JavaScript/JSX</option>
            <option value="postgresql">Postgresql</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="markdown">Markdown</option>
          </select>

          <div
            className={styles.editSectionButtons}
            data-position={props.position}
          >
            <button onClick={(event) => {
              event.preventDefault()
              setPreviewingSection(!previewingSection)
            }}>
              {previewingSection ? 'Stop Previewing' : 'Preview'}
            </button>
            <button onClick={() => {
              props.handleSectionDelete(props.id, props.postId)
            }}>
              Delete
            </button>
          </div>
        </div>
        
        {previewingSection && (
          <div className={styles[`${props.type}PreviewBox`]}>
            <>
              {formattedText}
            </>        
          </div>
        )}

        <div 
          className={styles[props.type]}
          data-position={props.position}
        >
          <textarea
            id={props.id}
            cols='75'
            key={`${props.type}-${props.id}`}
            data-type={props.type}
            data-position={props.position}
            onChange={(event) => props.handleSectionChange(event, 'body')}
            rows='16'
            value={props.body}
          >
          </textarea>                
        </div>
      </div>
    ) : (
      <div
        className={`${styles[props.type]} ${props.type === 'markdown' ? styles.completedMarkdown : styles.completed}`}
        id={props.id}
        key={`${props.position}-${props.id}`}
      >
        {FormatText[props.type](props.body)}
      </div>
    )
  )
}

export default Section;