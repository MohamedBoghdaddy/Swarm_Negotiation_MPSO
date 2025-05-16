import React from "react";
import { Container } from "react-bootstrap";
import "../../styles/home.css";

const ScenarioSection = () => {
  return (
    <section className="scenario-section py-5 bg-light">
      <Container>
        <h2 className="text-center mb-5 fw-bold text-uppercase">
          MPSO Negotiation Example
        </h2>

        <div className="scenario-timeline">
          {/* Step 0: User Offer */}
          <div className="timeline-item">
            <div className="timeline-header d-flex justify-content-between align-items-center">
              <h4 className="mb-0">📤 User Initial Offer</h4>
              <span className="badge bg-primary">Round 0</span>
            </div>
            <div className="timeline-content mt-2">
              <ul>
                <li>
                  <strong>Fabric:</strong> Cotton
                </li>
                <li>
                  <strong>Quantity:</strong> 100 meters
                </li>
                <li>
                  <strong>Target Price:</strong> $5/meter
                </li>
                <li>
                  <strong>Preferred Quality:</strong> Premium
                </li>
                <li>
                  <strong>Delivery Deadline:</strong> 6 days
                </li>
              </ul>
            </div>
          </div>

          {/* Step 1: Manufacturer Offers */}
          <div className="timeline-item">
            <div className="timeline-header d-flex justify-content-between align-items-center">
              <h4 className="mb-0">🏭 Manufacturer Responses</h4>
              <span className="badge bg-secondary">Round 1</span>
            </div>
            <div className="timeline-content mt-2">
              <div className="manufacturer-response mb-3">
                <h5>Manufacturer A</h5>
                <ul>
                  <li>Price: $11</li>
                  <li>Quality: Premium</li>
                  <li>Delivery: 5 days</li>
                </ul>
              </div>
              <div className="manufacturer-response">
                <h5>Manufacturer B</h5>
                <ul>
                  <li>Price: $9</li>
                  <li>Quality: Standard</li>
                  <li>Delivery: 7 days</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 2: MPSO Optimization */}
          <div className="timeline-item">
            <div className="timeline-header d-flex justify-content-between align-items-center">
              <h4 className="mb-0">🤖 MPSO Optimized Suggestion</h4>
              <span className="badge bg-success">Round 2</span>
            </div>
            <div className="timeline-content mt-2">
              <p>
                Tuah's Swarm Intelligence recommends accepting a refined version
                of Manufacturer B’s offer: <strong>$8/meter</strong>,{" "}
                <strong>Premium Quality</strong>, and{" "}
                <strong>7-day delivery</strong> — the best balance of cost,
                quality, and time.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ScenarioSection;
