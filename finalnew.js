
const addQuestionBtn = document.getElementById('addQuestion');
const btnText = addQuestionBtn.innerText;
const question = document.getElementById("question");
const questionId = document.getElementById("questionId");
const statusData = document.getElementById("status");
const recordDisplay = document.getElementById('records')
const fromQuantity = document.getElementById('fromQuantity');
const toQuantity = document.getElementById('toQuantity');

let questionArray = [];
let edit_id = null


DisplayInfo()
addQuestionBtn.onclick = () => {
    const quesId = questionId.value;
    const ques = question.value;
    const status = statusData.value;
    const from = fromQuantity.value
    const to = toQuantity.value

    const questionData = {
        ques: ques,
        questionId: quesId,
        status : status,
        conditions: {
            valid_responses: [{
                from: from,
                to: to
            }] 
        }
    };

    questionArray.push(questionData)

    fetch('http://localhost:4000/addQuestion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionData)
    })
    .catch(error => {
        console.error('Error:', error);
    });
};




function DisplayInfo() {
    fetch('http://localhost:4000/getData')
        .then(response => response.json())
        .then(serverData => {
            const combinedData = questionArray.concat(serverData);

            let statement = '';
            combinedData.forEach((item, i) => {
               
                const fromQuantity = item.conditions.valid_responses[0].from;
                const toQuantity = item.conditions.valid_responses[0].to;
                const validDataHtml = `From: ${fromQuantity}, To: ${toQuantity}`;

                statement += `
                    <tr>
                        <th scope="row">${i + 1}</th>
                        <td>${item.questionId}</td>
                        <td>${item.ques}</td>
                        <td>${item.status}</td>   
                        <td>${validDataHtml}</td> <!-- Display "from" and "to" values -->
                        <td>
                            <i class="fa fa-trash-o" onclick="DeleteInfo(${i})" style="font-size:24px"></i> 
                            <i class="fa fa-edit" onclick="EditInfo(${i})" style="font-size:20px"></i> 
                        </td>
                    </tr>`;
            });


            recordDisplay.innerHTML = statement;

        })
        .catch(error => {
            console.error('Error:', error);
        });
}



function EditInfo(index) {

    fetch(`http://localhost:4000/getData`)
        .then(response => response.json())
        .then(data => {
            const item = data[index];
            if (item) {
                questionId.value = item.questionId; 
                question.value = item.ques;
                statusData.value = item.status;
                fromQuantity.value = item.conditions.valid_responses[0].from;
                toQuantity.value = item.conditions.valid_responses[0].to;
                addQuestionBtn.innerText = "Save Changes";

                addQuestionBtn.onclick = () => {
                    const updatedQuestionId = questionId.value;
                    const updatedQuestion = question.value;
                    const updatedStatus = statusData.value;
                    const updateFrom = fromQuantity.value;
                    const updateTo = toQuantity.value;

                    // Create an object to hold the updated question data
                    const updatedQuestionData = {
                        questionId: updatedQuestionId,
                        ques: updatedQuestion,
                        status: updatedStatus,
                        conditions: {
                            valid_responses: [{
                            from: updateFrom,
                            to : updateTo
                           }]
                        }
                        

                    };

                    fetch(`http://localhost:4000/${index}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedQuestionData)
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                };
            } else {
                console.error('Item not found for index:', index);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}







function DeleteInfo(index) {
    fetch(`http://localhost:4000/${index}`, {
        method: 'DELETE',
    }) 
    .catch(error => {
        console.error('Error:', error);
    });
}


// Function to download the finalnew.json file
function downloadQuesJson() {
    // Fetch the data from the server
    fetch('http://localhost:4000/getData')
        .then(response => response.json())
        .then(data => {
            // Call the function to save the data to JSON file
            saveDataToJsonFile(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



// Downlode the ques.json file
function saveDataToJsonFile(data) {
    const jsonData = JSON.stringify(data, null, 2);

    // Create a Blob with the JSON data
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Create a link element
    const a = document.createElement('a');
    console.log("a", a);
    a.href = window.URL.createObjectURL(blob);

    a.download = 'finalnew.json';

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
}
