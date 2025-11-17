import { useState, useEffect } from 'react';
import { checkHealth } from '../utils/api';

export const HealthBanner = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    const checkServerHealth = async () => {
      const healthy = await checkHealth();
      setIsHealthy(healthy);
    };

    checkServerHealth();
    // Check health every 5 seconds
    const interval = setInterval(checkServerHealth, 5000);

    return () => clearInterval(interval);
  }, []);

  if (isHealthy === null) {
    return null; // Don't show banner while checking
  }

  return (
    <div
      className={`health-banner ${isHealthy ? 'health-banner--ok' : 'health-banner--error'}`}
      data-testid="health-banner"
    >
      <span className="health-banner__text">
        System health: {isHealthy ? 'OK' : 'ERROR'}
      </span>
    </div>
  );
};

