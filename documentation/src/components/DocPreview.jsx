/**
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the ''License''); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * ''AS IS'' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import Documentation from './Documentation';

export default class DocPreview extends React.Component {
    getDocumentationDetails(node) {
        const { markdownDocumentationAttachment: mdDoc } = node;

        let parameters = {};
        if(this[`_get${node.kind}Parameters`]) {
            parameters = this[`_get${node.kind}Parameters`](node);
        }

        const processedParameters = mdDoc.parameters.map((param) => {
            const name = param.parameterName.value
            const { type, defaultValue } =  parameters[name] || {};
            const description = param.parameterDocumentation;
            return {
                name, type, defaultValue, description
            };
        });

        let returnParameter;
        if (node.returnTypeNode) {
            returnParameter = {
                type: node.returnTypeNode.typeKind,
                description: mdDoc.returnParameterDocumentation,
            };
        }
        const documentationDetails = {
            kind: node.kind,
            title: node.name.value,
            description: mdDoc.documentation,
            parameters: processedParameters,
            returnParameter
        };
        return documentationDetails;
    }

    _getFunctionParameters(node) {
        const parameters = {};
        node.parameters.forEach(param => {
            parameters[param.name.value] = {
                name: param.name.value,
                type: param.typeNode.typeKind,
            };
        });
        node.defaultableParameters.forEach(param => {
            parameters[param.variable.name.value] = {
                name: param.variable.name.value,
                type: param.variable.typeNode.typeKind,
                defaultValue: param.variable.initialExpression.value,
            };
        });
        return parameters;
    }

    _getTypeDefinitionParameters(node) {
        const parameters = {};
        node.typeNode.fields.forEach(field => {
            parameters[field.name.value] = {
                name: field.name.value,
                type: field.typeNode.typeKind,
                defaultValue: field.initialExpression ? field.initialExpression.value: "",
            };
        });
        return parameters;
    }

    render() {
        const docElements = [];
        this.props.ast.topLevelNodes.forEach(node => {
            if(node.markdownDocumentationAttachment) {
                const docDetails = this.getDocumentationDetails(node);
                docElements.push(
                    <Documentation docDetails={docDetails}/>
                );
            }
        });
        return docElements;
    }
}
