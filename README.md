# FT_TRANSCENDENCE
## Description
Ft_transcendence is the final project of 42's common core curriculum, where you need to create a single-page web application that allows users to play Pong in real-time and more. This project reinforces your skills in full-stack web development, authentication, websockets, and real-time state management.
<br><br>
*For more information, please refer to the subject in the git.*

## Collaboration
This project involved collaboration with my teammates:
- [Ezuker](https://github.com/Ezuker)  
- [Ehlzz](https://github.com/Ehlzz)

## Installation
Clone the project:
```bash
git clone https://github.com/fZpHr/ft_transcendence_42.git
```

Build and run the project using Docker:
```bash
make
```

## Technologies Used
- Frontend: Vite.js with Bootstrap
- Backend: Django REST Framework
- Database: PostgreSQL
- Authentication: 42 API OAuth
- Containerization: Docker
- Monitoring: Grafana/Prometheus
- Security: ModSecurity, Vault
- Logging: ELK Stack (Elasticsearch, Logstash, Kibana)

## Features and Scoring System
> [!IMPORTANT]
>
> • Major module score: `+1.0 / module`
>
> • Minor module score: `+0.5 / module`
>
> • **Required Score**: `7.0`
>
> • **Required Score to get all bonuses**: `9.5`
>
> • **Final Score Achieved**: `11.5/9.5`

### Major Modules (9 × 1.0 = 9.0)
- ✅ ModSecurity / Vault Implementation
- ✅ Advanced Logging System (ELK Stack)
- ✅ Additional Game: Connect4 with Matchmaking
- ✅ 42 API Authentication Integration
- ✅ Microservices Architecture
- ✅ AI Opponent System
- ✅ Django Backend Framework
- ✅ Real-time Multiplayer Support
- ✅ Advanced 3D Graphics Implementation

### Minor Modules (5 × 0.5 = 2.5)
- ✅ Customizable Game Settings
- ✅ Grafana/Prometheus Monitoring
- ✅ Bootstrap Frontend Framework
- ✅ PostgreSQL Database Integration
- ✅ Cross-browser Compatibility

## Features Overview

### Authentication & Security
- Secure login via 42 API
- Vault secret management
- ModSecurity web application firewall

### Gaming Experience
- Classic Pong game with 3D graphics
- Connect4 with matchmaking system
- AI opponent for single-player mode
- Real-time multiplayer functionality
- Customizable game settings

### Technical Infrastructure
- Microservices architecture
- ELK stack for log management
- Grafana/Prometheus monitoring
- Cross-browser compatibility
- PostgreSQL database
- Django REST Framework backend
- Vite.js frontend with Bootstrap

## Development
To monitor the application:
- Grafana Dashboard: `http://localhost:3000`
- Kibana (Logs): `http://localhost:5601`
- Portainer: `https://localhsot:9443`
 
