export const schema = {
    "models": {
        "Event": {
            "name": "Event",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "date": {
                    "name": "date",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": true,
                    "attributes": []
                },
                "numPlayers": {
                    "name": "numPlayers",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": true,
                    "attributes": []
                },
                "players": {
                    "name": "players",
                    "isArray": true,
                    "type": {
                        "nonModel": "Player"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "teams": {
                    "name": "teams",
                    "isArray": true,
                    "type": {
                        "nonModel": "Team"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "matches": {
                    "name": "matches",
                    "isArray": true,
                    "type": {
                        "nonModel": "Match"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "orderedMatches": {
                    "name": "orderedMatches",
                    "isArray": true,
                    "type": {
                        "nonModel": "Match"
                    },
                    "isRequired": true,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Events",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "provider": "userPools",
                                "ownerField": "owner",
                                "allow": "owner",
                                "identityClaim": "cognito:username",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete"
                                ]
                            },
                            {
                                "allow": "private",
                                "operations": [
                                    "update",
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "User": {
            "name": "User",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Users",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "provider": "userPools",
                                "ownerField": "owner",
                                "allow": "owner",
                                "identityClaim": "cognito:username",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete"
                                ]
                            },
                            {
                                "allow": "private",
                                "operations": [
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    },
    "enums": {
        "MatchStatus": {
            "name": "MatchStatus",
            "values": [
                "NEW",
                "TEAM1WON",
                "TEAM2WON",
                "DRAW"
            ]
        }
    },
    "nonModels": {
        "Player": {
            "name": "Player",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "stats": {
                    "name": "stats",
                    "isArray": false,
                    "type": {
                        "nonModel": "PlayerStats"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "user": {
                    "name": "user",
                    "isArray": false,
                    "type": {
                        "model": "User"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "PlayerStats": {
            "name": "PlayerStats",
            "fields": {
                "numMatches": {
                    "name": "numMatches",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": true,
                    "attributes": []
                },
                "numWon": {
                    "name": "numWon",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": true,
                    "attributes": []
                },
                "numDraws": {
                    "name": "numDraws",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": true,
                    "attributes": []
                },
                "numLost": {
                    "name": "numLost",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": true,
                    "attributes": []
                }
            }
        },
        "Team": {
            "name": "Team",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "players": {
                    "name": "players",
                    "isArray": true,
                    "type": {
                        "nonModel": "Player"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "stats": {
                    "name": "stats",
                    "isArray": false,
                    "type": {
                        "nonModel": "PlayerStats"
                    },
                    "isRequired": true,
                    "attributes": []
                }
            }
        },
        "Match": {
            "name": "Match",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "teams": {
                    "name": "teams",
                    "isArray": true,
                    "type": {
                        "nonModel": "Team"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": {
                        "enum": "MatchStatus"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            }
        }
    },
    "version": "7867c9684371279563ce4b9397d9b65d"
};