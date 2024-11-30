import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts/1', true);

    xhr.onload = () => {
      if (xhr.status === 200) {
        const json: Post = JSON.parse(xhr.responseText);  // Parse the JSON response
        setData(json);
        setLoading(false);
      } else {
        setError(`Error: ${xhr.status}`);
        setLoading(false);
      }
    };

    xhr.onerror = () => {
      setError('Network Error');
      setLoading(false);
    };

    xhr.send();  // Send the request
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Title: {data?.title}</Text>
      <Text>Body: {data?.body}</Text>
    </View>
  );
};

export default App;
