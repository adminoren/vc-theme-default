var storefrontApp = angular.module('storefrontApp');

storefrontApp.component('vcCustomerReviews', {
    templateUrl: "themes/assets/js/components/customer-reviews/customerReviews.tpl.html",
    bindings: {
        productid: '@',
        user: '<'
    },
    controller: ['$scope', 'customerReviewService', 'storefrontApp.mainContext', function ($scope, customerReviewService, mainContext) {
        var ctrl = this;
        ctrl.submitReviewFormVisible = false;

        ctrl.setForm = function (frm) {
            ctrl.submitReviewForm = frm;
        };

        this.$onInit = function () {

            customerReviewService.search({ ProductIds: [ctrl.productid] }).then(function (reviews) {
                ctrl.customerReviews = reviews.data;
            });

            customerReviewService.checkIfSubmitAvailable().then(function (res) {
                ctrl.submitReviewAvailable = res.data.isValid;
                ctrl.message = res.data.message;
            });
        };

        ctrl.submit = function (submitReviewForm) {
            submitReviewForm.$setSubmitted();

            if (submitReviewForm.$invalid) {
                return;
            }

            var newReview = {
                content: ctrl.content,
                authorNickname: ctrl.authorNickname,
                productid: ctrl.productid,
                rating: ctrl.rating
            }
            customerReviewService.addCustomerReview(newReview).then(function (review) {
                ctrl.customerReviews.unshift(review.data);
                ctrl.cancel();
            });
        };

        ctrl.cancel = function () {
            ctrl.submitReviewFormVisible = false;
            ctrl.submitReviewForm.$setPristine();
        };

        ctrl.showSubmitReviewForm = function() {
            ctrl.submitReviewFormVisible = true;
            ctrl.authorNickname = ctrl.user.fullName;
        }

        this.$onDestroy = function () {
        };
    }]
});
