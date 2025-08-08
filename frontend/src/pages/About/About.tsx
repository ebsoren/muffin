import Board from './components/Board'
import Members from './components/Members';

export function About() {
  return (
    <div className="min-h-screen w-full mx-20 bg-white dark:bg-custom-black duration-200">
      <Board/>
      <Members/>
    </div>
  );
} 