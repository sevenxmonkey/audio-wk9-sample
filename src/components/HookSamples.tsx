import React, { useEffect, useRef, useState } from 'react';

export const HookSample1 = (): JSX.Element => {
  const refContainer = useRef<HTMLDivElement | null>(null)

  const showContainerDOM = (e: React.MouseEvent) => {
    if (refContainer.current) {
      const { left, top } = refContainer.current.getBoundingClientRect();
      console.log(e.clientX - left, e.clientY - top);
    }
  }

  return (
    <div
      ref={refContainer}
      onClick={showContainerDOM}
      className='container'
    >useRef sample</div>
  )
}

export const HookSample2 = (): JSX.Element => {
  const [text, setText] = useState<string>('State A');

  const updateState = () => {
    if (text === 'State A') {
      setText('State B');
    } else {
      setText('State A');
    }
  }

  useEffect(() => {
    console.log('This is effect of text:', text);
  }, [text])

  useEffect(() => {
    console.log('Initialize on render');
    return () => {
      console.log('Component destroy');
    }
  }, [])

  return (
    <div
      className='container'
      onClick={updateState}
    >
      {text}
    </div>
  )
}