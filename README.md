# AI Warehouse Storage Optimization System

An AI-powered warehouse management platform that helps businesses efficiently allocate storage space using a 3D bin packing optimization algorithm. The system allows users to reserve warehouse storage, visualize product placement, and analyze storage usage through interactive dashboards and reports.

The application combines modern full-stack development with optimization algorithms to improve warehouse space utilization and operational efficiency.

## Overview
This project is a full-stack application designed to help companies optimize warehouse storage by automatically determining the best way to place items in available space.

Users can:
- Log in securely using Google authentication
- Reserve warehouse storage for products
- View optimized storage layouts
- Monitor storage usage and analytics on intuitive dashboard
- Generate reports and insights about storage efficiency

## Why We Built This
Warehouse operations often struggle with inefficient storage allocation, leading to wasted space and higher operational costs.
This project was built to:
- Apply algorithmic optimization to real-world logistics problems
- Develop a full-stack system with modern technologies
- Implement AI-driven decision making using optimization algorithms

## Tech Stack
- Frontend - React.js, Material UI
- Backend - FastAPI (Python)
- Database - MySQL
- Optimization - 3D Bin Packing Algorithm

## Optimization Algorithm
The system uses a 3D bin packing optimization algorithm to determine the most efficient way to place products within warehouse containers. The optimizer generates a warehouse layout visualization showing how products and containers are arranged to maximize storage efficiency while maintaining safe placement.


### Key aspects of the algorithm:

3D Bin Packing Optimization
- Products are organized into containers (bins) to maximize warehouse space utilization.

Greedy Packing Heuristic
- Items are placed sequentially in available space to efficiently fill containers.

Weight-Aware Vertical Stacking
- Heavier products are never placed on top of lighter products to ensure safe stacking.

Warehouse Dimension Constraints
- Ensures products and containers remain within the warehouse size limits.

Row-Based Warehouse Layout
- Containers are arranged row by row while maintaining walking space between rows for employee access.

Interactive 3D Visualization
- Users can rotate and explore the warehouse layout. Hovering over products displays their Product ID, and hovering over containers shows their location coordinates.

## Analytics Dashboard
Interactive dashboards provide insights into:
- Storage usage
- Order breakdown
- Cost analysis
- Optimization efficiency

## Setup Instructions
1. Clone the Repository
  - git clonehttps://github.com/vidhipatel1589/-StockOverflow.git
  - cd ./-StockOverflow

2. Install Frontend Dependencies
  - cd frontend
  - npm install
  - npm start

3. Install Backend Dependencies
  - cd backend
  - pip install -r requirements.txt

4. Run the backend server
  - uvicorn main:app --reload





