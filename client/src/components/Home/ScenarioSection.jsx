import React from "react";
import { Container } from "react-bootstrap";
import "../../styles/home.css";

const ScenarioSection = () => {
  return (
    <section className="scenario-section py-5 bg-light">
      <Container>
        <h2 className="text-center mb-5">Example Negotiation Scenario</h2>
        <div className="scenario-timeline">
          <div className="timeline-item">
            <div className="timeline-header">
              <h4>User Initial Offer</h4>
              <span className="badge bg-primary">Round 0</span>
            </div>
            <div className="timeline-content">
              <ul>
                <li>Fabric: Cotton</li>
                <li>Quantity: 100 meters</li>
                <li>Price: $5 per meter</li>
                <li>Quality: Premium</li>
                <li>Delivery: 6 days</li>
              </ul>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-header">
              <h4>Manufacturer Responses</h4>
              <span className="badge bg-secondary">Round 1</span>
            </div>
            <div className="timeline-content">
              <div className="manufacturer-response">
                <h5>Manufacturer 1</h5>
                <ul>
                  <li>Price: $11</li>
                  <li>Quality: Premium</li>
                  <li>Delivery: 5 days</li>
                </ul>
              </div>
              <div className="manufacturer-response">
                <h5>Manufacturer 2</h5>
                <ul>
                  <li>Price: $9</li>
                  <li>Quality: Standard</li>
                  <li>Delivery: 7 days</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-header">
              <h4>MPSO Optimized Offers</h4>
              <span className="badge bg-success">Round 2</span>
            </div>
            <div className="timeline-content">
              <p>
                The algorithm recommends accepting Manufacturer 2's offer at $8
                per meter, Premium quality, with 7-day delivery as the optimal
                solution.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ScenarioSection;
