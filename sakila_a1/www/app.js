angular.module('chriswebApp', ['ui.router', 'ui.bootstrap', 'pasvaz.bindonce']);

angular.module('chriswebApp').config(function($locationProvider, $stateProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('chris-home', {
        url: '/home',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-home/chris-home.html'
            }
        }
    });
    $stateProvider.state('chris-login', {
        url: '/login',
        views: {
            'content': {
                templateUrl: '/partials/chris-login/chris-login.html'
            }
        }
    });
    $stateProvider.state('chris-customers', {
        url: '/customers',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-customers/chris-customers.html'
            }
        }
    });
    $stateProvider.state('chris-customers-detail-addnew', {
        url: '/customers/new',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-customers/chris-customers-detail-addnew.html'
            }
        }
    });
    $stateProvider.state('chris-customers-detail-addnew-edit', {
        url: '/customers/edit/:customerId',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-customers/chris-customers-detail-addnew.html'
            }
        }
    });
    $stateProvider.state('chris-customers-detail-addnew-copy', {
        url: '/customers/copy/:customerId',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-customers/chris-customers-detail-addnew.html'
            }
        }
    });
    $stateProvider.state('chris-customers-detail', {
        url: '/customers/:customerId/:selectedItem',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-customers/chris-customers-detail.html'
            }
        }
    });
    $stateProvider.state('chris-country', {
        url: '/country',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-country/chris-country.html'
            }
        }
    });
    $stateProvider.state('chris-country-detail-addnew', {
        url: '/country/new',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-country/chris-country-detail-addnew.html'
            }
        }
    });
    $stateProvider.state('chris-country-detail-addnew-edit', {
        url: '/country/edit/:countryId',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-country/chris-country-detail-addnew.html'
            }
        }
    });
    $stateProvider.state('chris-country-detail-addnew-copy', {
        url: '/country/copy/:countryId',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-country/chris-country-detail-addnew.html'
            }
        }
    });
    $stateProvider.state('chris-country-detail', {
        url: '/country/:countryId/:selectedItem',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-country/chris-country-detail.html'
            }
        }
    });


    $stateProvider.state('chris-city', {
        url: '/city',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-city/chris-city.html'
            }
        }
    });
    $stateProvider.state('chris-city-detail-addnew', {
        url: '/city/new',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-city/chris-city-detail-addnew.html'
            }
        }
    });
    $stateProvider.state('chris-city-detail-addnew-edit', {
        url: '/city/edit/:cityId',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-city/chris-city-detail-addnew.html'
            }
        }
    });
    $stateProvider.state('chris-city-detail-addnew-copy', {
        url: '/city/copy/:cityId',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-city/chris-city-detail-addnew.html'
            }
        }
    });
    $stateProvider.state('chris-city-detail', {
        url: '/city/:cityId/:selectedItem',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-city/chris-city-detail.html'
            }
        }
    });

    $stateProvider.state('chris-address', {
        url: '/address',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-address/chris-address.html'
            }
        }
    });
    $stateProvider.state('chris-address-detail-addnew', {
        url: '/address/new',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-address/chris-address-detail-addnew.html'
            }
        }
    });
    $stateProvider.state('chris-address-detail-addnew-edit', {
        url: '/address/edit/:addressId',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-address/chris-address-detail-addnew.html'
            }
        }
    });
    $stateProvider.state('chris-address-detail-addnew-copy', {
        url: '/address/copy/:addressId',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-address/chris-address-detail-addnew.html'
            }
        }
    });
    $stateProvider.state('chris-address-detail', {
        url: '/address/:addressId/:selectedItem',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-address/chris-address-detail.html'
            }
        }
    });
    $stateProvider.state('chris-rental', {
        url: '/rental',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-rental/chris-rental.html'
            }
        }
    });
    $stateProvider.state('chris-rental-detail-addnew', {
        url: '/rental/new',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-rental/chris-rental-detail-addnew.html'
            }
        }
    });
    $stateProvider.state('chris-rental-detail-addnew-edit', {
        url: '/rental/edit/:rentalId',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-rental/chris-rental-detail-addnew.html'
            }
        }
    });
    $stateProvider.state('chris-rental-detail-addnew-copy', {
        url: '/rental/copy/:rentalId',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-rental/chris-rental-detail-addnew.html'
            }
        }
    });
    $stateProvider.state('chris-rental-detail', {
        url: '/rental/:rentalId/:selectedItem',
        views: {
            'header': {
                templateUrl: '/directives/chris-header/chris-header.html'
            },
            'sidebar': {
                templateUrl: '/directives/chris-sidebar/chris-sidebar.html'
            },
            'content': {
                templateUrl: '/partials/chris-rental/chris-rental-detail.html'
            }
        }
    });
    $urlRouterProvider.otherwise('/login');
});