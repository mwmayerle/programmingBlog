import React from 'react'

import AlgorithmsIcon from '../../assets/images/icons/algorithms.png'
import HtmlCssIcon from '../../assets/images/icons/css.png';
import JavascriptIcon from '../../assets/images/icons/js.png';
import MathIcon from '../../assets/images/icons/math.png';
import MiscIcon from '../../assets/images/icons/misc.png';
import PostgresqlIcon from '../../assets/images/icons/postgres.png';
import ReactIcon from '../../assets/images/icons/react.png';
import RubyIcon from '../../assets/images/icons/ruby.png';
import styles from './NavBarTopic.module.scss';


const NavBarTopic = props => {
  const getIcon = () => {
    switch(props.title) {
      case 'algorithms-math':
        return AlgorithmsIcon;
      case 'ruby':
        return RubyIcon;
      case 'javascript':
        return JavascriptIcon;
      case 'postgresql':
        return PostgresqlIcon;
      case 'react-redux':
        return ReactIcon;
      case 'html-css':
        return HtmlCssIcon;
      case 'design-patterns':
        return MathIcon;
      case 'miscellaneous':
        return MiscIcon;
    };
  };

  const getTitle = () => {
    switch(props.title) {
      case 'algorithms-math':
        return 'Algorithms/Math';
      case 'ruby':
        return 'Ruby';
      case 'javascript':
        return 'JavaScript';
      case 'postgresql':
        return 'Postgresql';
      case 'react-redux':
        return 'React';
      case 'html-css':
        return 'HTML/CSS';
      case 'design-patterns':
        return 'Design Patterns';
      case 'miscellaneous':
        return 'Miscellaneous';
    };
  };

  return (
    <li className={styles.navbarLi}>
      <button 
        className={styles.navBarAnchor}
        onClick={props.getTopicData.bind(null, props.topicId, getTitle())}
      >
        <img className={styles.navBarIcon} src={getIcon()}></img>
        {getTitle()}
      </button>
    </li>
  )
};

export default NavBarTopic;