import './App.css';
import { Card } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  abilities: string[];
  image: string;
}

function App() {

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersResponse = await axios.get<User[]>('https://jsonplaceholder.typicode.com/users');

        const imageUrls = [
          'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png', // URL de la primera imagen
          'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/005.png',
          'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/006.png',
          'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/009.png',
          'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/011.png',
          'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/012.png',
          'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/002.png',
          'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/003.png',
          'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/008.png',
          'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/010.png'

           // URL de la segunda imagen
          // Agrega más URLs de imágenes aquí según sea necesario
        ];

        const usersWithAbilities = await Promise.all(
          usersResponse.data.map(async (user, index) => {
            // Realiza otra solicitud para obtener las habilidades de los Pokémon
            const abilitiesResponse = await axios.get(`https://pokeapi.co/api/v2/ability/`);
            // Obtén los nombres de las habilidades
            const abilities = abilitiesResponse.data.results.map((ability: any) => ability.name);
            return { ...user, abilities, image: imageUrls[index % imageUrls.length] }; // Agrega las habilidades al usuario
          })
        );
        setUsers(usersWithAbilities);
        setLoading(false);
      } catch (error) {
        setError('Error al obtener datos');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="App">
      
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {users.map((user, index) => (
        <Card
          className="Card"
          hoverable
          style={{ width: '30%' }}
          key={user.id}
          cover={<img alt={user.name} src={user.image} />}
        >
          <Card.Meta title={user.name} description={`Power: ${user.abilities[index % user.abilities.length]}`} />
        </Card>
      ))}
    </div>
  );
}

export default App;