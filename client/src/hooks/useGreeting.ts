export function useGreeting(name: string) {
  const hour = new Date().getHours();

  let greeting: string;
  let emoji: string;

  if (hour >= 5 && hour < 12) {
    greeting = 'Good morning';
    emoji = '☀️';
  } else if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
    emoji = '🌤️';
  } else if (hour >= 17 && hour < 21) {
    greeting = 'Good evening';
    emoji = '🌅';
  } else {
    greeting = 'Good night';
    emoji = '🌙';
  }

  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return { greeting: `${greeting}, ${name}`, emoji, date };
}
