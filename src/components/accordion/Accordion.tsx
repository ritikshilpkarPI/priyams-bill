import React, { useState, useRef, useEffect } from 'react';
import styles from './Accordion.module.css';



const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [height, setHeight] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen, children]);

  return (
    <div className={styles.accordion}>
      <div className={styles.accordionHeader} onClick={toggleAccordion}>
        <h2 className={styles.accordionTitle}>{title}</h2>
        <span className={styles.accordionToggle}>
          {isOpen ? '–' : '+'}
        </span>
      </div>

      <div
        className={styles.accordionContentWrapper}
        style={{
          maxHeight: isOpen ? height : 0,
        }}
      >
        <div ref={contentRef} className={styles.accordionContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
