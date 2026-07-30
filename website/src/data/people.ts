export interface Person {
  id: string
  name: string
  email: string
  role: string
  team: string
}

export const people: Person[] = [
  { id: '1', name: 'Ada Lovelace', email: 'ada@example.com', role: 'Engineer', team: 'Compilers' },
  { id: '2', name: 'Grace Hopper', email: 'grace@example.com', role: 'Engineer', team: 'Compilers' },
  { id: '3', name: 'Alan Turing', email: 'alan@example.com', role: 'Researcher', team: 'Runtime' },
  { id: '4', name: 'Katherine Johnson', email: 'katherine@example.com', role: 'Analyst', team: 'Tooling' },
  { id: '5', name: 'Margaret Hamilton', email: 'margaret@example.com', role: 'Engineer', team: 'Runtime' },
  { id: '6', name: 'Radia Perlman', email: 'radia@example.com', role: 'Engineer', team: 'Runtime' },
  { id: '7', name: 'Barbara Liskov', email: 'barbara@example.com', role: 'Researcher', team: 'Compilers' },
  { id: '8', name: 'Frances Allen', email: 'frances@example.com', role: 'Researcher', team: 'Compilers' },
  { id: '9', name: 'Adele Goldberg', email: 'adele@example.com', role: 'Engineer', team: 'Tooling' },
  { id: '10', name: 'Annie Easley', email: 'annie@example.com', role: 'Analyst', team: 'Tooling' },
  { id: '11', name: 'Shafi Goldwasser', email: 'shafi@example.com', role: 'Researcher', team: 'Runtime' },
  { id: '12', name: 'Jean Bartik', email: 'jean@example.com', role: 'Engineer', team: 'Compilers' }
]
