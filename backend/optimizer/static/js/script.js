// /static/js/script.js

// Wait for the document to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
    var ctx = document.getElementById('myChart').getContext('2d');
    
    // Chart.js configuration
    var myChart = new Chart(ctx, {
        type: 'bar', // Chart type (bar chart)
        data: {
            labels: ['January', 'February', 'March', 'April', 'May'], // X-axis labels
            datasets: [{
                label: 'Sales Data',
                data: [12, 19, 3, 5, 2], // Y-axis data
                backgroundColor: '#42a5f5', // Bar color
                borderColor: '#1e88e5', // Bar border color
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
