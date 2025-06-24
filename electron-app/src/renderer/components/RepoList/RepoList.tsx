import React, { useEffect, useState } from 'react';

interface Repo {
    id: number;
    name: string;
    html_url: string;
    description: string;
    watchers_count: number;
    stargazers_count: number;
    language: string;
    visibility: string;
}

const RepoList: React.FC<{}> = ({}) => {
    const accessToken = sessionStorage.getItem('access_token');
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRepos = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('https://api.github.com/user/repos', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept': 'application/vnd.github.v3+json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setRepos(data);
                } else {
                    setError('Failed to fetch repositories');
                }
            } catch (err) {
                setError('Error fetching repositories');
            }
            setLoading(false);
        };
        fetchRepos();
    }, [accessToken]);

    if (loading) return <div>Loading repositories...</div>;
    if (error) return <div style={{color: 'red'}}>{error}</div>;

    return (
        <div>
            <h2>Your GitHub Repositories</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Name</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Description</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Watchers</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Stars</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Language</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Visibility</th>
                    </tr>
                </thead>
                <tbody>
                    {repos.map(repo => (
                        <tr key={repo.id}>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name}</a>
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                {repo.description}
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                {repo.watchers_count}
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                {repo.stargazers_count}
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                {repo.language}
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                {repo.visibility}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RepoList;