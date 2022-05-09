import pandas as pd
from flask import Flask, jsonify, request
import pickle

# load model
# app
app = Flask(__name__)

clf = pickle.load(open('clf.pkl','rb'))
loaded_vec = pickle.load(open('count_vect.pkl', 'rb'))

# routes
@app.route('/predict', methods=['GET', 'POST'])
def predict():
    # get data
    
    #data = request.get_json
    data = request.args['t']
    # convert data into dataframe
    result = clf.predict(loaded_vec.transform([data]))
    output = {'results': int(result[0])}
    return jsonify(results=output)

@app.errorhandler(500)
def internal_error(error):

    return "500 error"

if __name__ == '__main__':
    app.run(port = 5000, debug=True)
