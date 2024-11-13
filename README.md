[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/bzPrOe11)
# CS3219 Project (PeerPrep) - AY2425S1
## Group: G46

### Note: 
- You can choose to develop individual microservices within separate folders within this repository **OR** use individual repositories (all public) for each microservice. 
- In the latter scenario, you should enable sub-modules on this GitHub classroom repository to manage the development/deployment **AND** add your mentor to the individual repositories as a collaborator. 
- The teaching team should be given access to the repositories as we may require viewing the history of the repository in case of any disputes or disagreements. 

### Run PeerPrep with docker-compose:
Prerequisite: Ensure that Docker is installed and running.
1. Clone the repository.
2. Ensure that the respective `.env` files for all microservices, and the frontend, have been added in.
3. In any IDE or terminal, `cd` to the project root directory, and run the following commands:
    - `docker-compose build --no-cache` to build the images
    - `docker-compose up -d` to run the web app on `localhost:3000`
    - `docker-compose down` to stop running the containers

### Production Deployment of PeerPrep
- The production build and deployment of PeerPrep is located under the `deployment` branch.
- Deployment link: http://g46-peerprep-env.eba-u9cm3q7g.ap-southeast-1.elasticbeanstalk.com/