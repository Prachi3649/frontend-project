const express = require('express');
const fs = require('fs');
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = 4000;
app.use(express.json());
app.use(cors()); // Enable CORS for all routes


app.post('/addQuestion', (req, res) => {
    // Assuming the request body contains the question data
    const questionData = req.body;
    
    // Read existing data from the JSON file
    fs.readFile(__dirname + '/finalnew.json', 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File does not exist, create a new file with the initial data
                const initialData = [questionData];
                fs.writeFile(__dirname + '/finalnew.json', JSON.stringify(initialData), 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                        res.status(500).json({ error: 'Error writing file' });
                        return;
                    }
                    res.status(200).json({ message: 'Data added successfully' });
                });
            } else {
                // Other file reading errors
                console.error('Error reading file:', err);
                res.status(500).json({ error: 'Error reading file' });
            }
            return;
        }

        let existingData = JSON.parse(data);

        // Append the new question data to the existing data
        existingData.push(questionData);

        // Write the updated data back to the JSON file
        fs.writeFile(__dirname + '/finalnew.json', JSON.stringify(existingData), 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                res.status(500).json({ error: 'Error writing file' });
                return;
            }
            console.log('Data added successfully');
            res.status(200).json({ message: 'Data added successfully' });
        });
    });
});


// Endpoint to Get a list of users
// app.get('/getUsers', function(req, res){
//     fs.readFile(__dirname + "/" + "finalnew.json", 'utf8', function(err, data){
//         // console.log(data);
//         res.end(data); // you can also use res.send()
//     });
// });

app.get('/getData', (req, res) => {
    // Read the data from the JSON file
    fs.readFile(__dirname + '/finalnew.json', 'utf8', (err, data) => {
        if (err) {
            // If the file doesn't exist or cannot be read, send an empty array as the response
            console.error('Error reading file:', err);
            res.status(200).json([]);
            return;
        }

        // Parse the JSON data
        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseError) {
            // If there's an error parsing the JSON data, send an empty array as the response
            console.error('Error parsing JSON:', parseError);
            res.status(200).json([]);
            return;
        }

        // If the parsed data is not an array, send an empty array as the response
        if (!Array.isArray(jsonData)) {
            console.error('Data is not an array:', jsonData);
            res.status(200).json([]);
            return;
        }

        // Send the JSON data as the response
        res.status(200).json(jsonData);
    });
});


app.put('/:index', function (req, res) { 
    const questionData = req.body;
    
    // Read the existing data from the JSON file
    fs.readFile(__dirname + "/finalnew.json", 'utf8', function (err, data) {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).json({ error: 'Error reading file' });
            return;
        }

        let dataArray = JSON.parse(data);
        const index = parseInt(req.params.index);

        if (index >= 0 && index < dataArray.length) {
            // Update the data at the specified index
            dataArray[index] = questionData;

            
            const updatedData = JSON.stringify(dataArray);

            fs.writeFile(__dirname + "/finalnew.json", updatedData, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    res.status(500).json({ error: 'Error writing file' });
                    return;
                }
                console.log('Data updated ==> successfully');
                res.status(200).json({ message: 'Data updated successfully' });
            });
        } else {
            res.status(404).json({ error: 'Index out of range' });
        }
    });
});

app.delete('/:index', function (req, res) {
     // Read the existing data from the JSON file
     fs.readFile(__dirname + "/finalnew.json", 'utf8', function (err, data) {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).json({ error: 'Error reading file' });
            return;
        }

        let dataArray = JSON.parse(data);
        const index = parseInt(req.params.index); 


        if (index >= 0 && index < dataArray.length) {
            dataArray.splice(index, 1);

            // Write the updated array back to the JSON file
            fs.writeFile(__dirname + "/finalnew.json", JSON.stringify(dataArray), 'utf8', function (err) {
                if (err) {
                    console.error('Error writing file:', err);
                    res.status(500).json({ error: 'Error writing file' });
                    return;
                }
                console.log('Data Delete successfully');
                res.status(200).json({ message: 'Data deleted successfully' });
            });
        } else {
            res.status(400).json({ error: 'Invalid index' });
        }
     })
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Endpoint to update a single user by id
// app.put('/:id', function (req, res) {
//     const questionData = req.body;

//     console.log("questionData", questionData);
    
//     // Read the existing user data from the JSON file
//     fs.readFile(__dirname + "/users.json", 'utf8', function (err, data) {
//         if (err) {
//             console.error('Error reading file:', err);
//             res.status(500).json({ error: 'Error reading file' });
//             return;
//         }

//         let users = JSON.parse(data);
//         console.log("users", users);
//         const userId = parseInt(req.params.question_id);
//         console.log("userId", userId);


//         // Check if the user exists
//         if (users.hasOwnProperty("user" + userId)) {
//             // Update the user data with the new question data
//             users["user" + userId] = questionData;

//             // Write the updated data back to the JSON file
//             fs.writeFile(__dirname + "/final.json", JSON.stringify(users), 'utf8', (err) => {
//                 if (err) {
//                     console.error('Error writing file:', err);
//                     res.status(500).json({ error: 'Error writing file' });
//                     return;
//                 }
//                 console.log('Data updated successfully');
//                 res.status(200).json({ message: 'Data updated successfully' });
//             });
//         } else {
//             res.status(404).json({ error: 'User not found' });
//         }
//     });
// });




